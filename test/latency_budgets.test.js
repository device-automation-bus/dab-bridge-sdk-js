import { jest } from "@jest/globals";
import { Client } from "../src/lib/mqtt_client/client.js";
import { getLatencyBudgetMs, DEFAULT_LATENCY_BUDGET_MS } from "../src/interface/dab_latency_budgets.js";
import { getLogger } from "../src/lib/util.js";

describe("getLatencyBudgetMs()", () => {
    test("uses the 200 ms default", () => {
        expect(DEFAULT_LATENCY_BUDGET_MS).toBe(200);
        expect(getLatencyBudgetMs("system/settings/get")).toBe(200);
        expect(getLatencyBudgetMs("input/key-press")).toBe(200);
    });

    test.each([
        ["applications/list", 250],
        ["applications/install", 60_000],
        ["applications/install-from-app-store", 60_000],
        ["applications/uninstall", 10_000],
        ["system/factory-reset", 600_000],
        ["output/image", 2_000],
        ["app-telemetry/start", 700],
    ])("%s has %i ms", (operation, budgetMs) => {
        expect(getLatencyBudgetMs(operation)).toBe(budgetMs);
    });

    test("input/long-key-press adds the key press duration", () => {
        expect(getLatencyBudgetMs("input/long-key-press", {keyCode: "KEY_OK", durationMs: 3000})).toBe(3200);
        expect(getLatencyBudgetMs("input/long-key-press", {})).toBe(200);
    });
});

describe("Client.handle() latency budget warning", () => {
    let warn;
    let now;

    beforeEach(() => {
        warn = jest.spyOn(getLogger(), "warn").mockImplementation(() => {});
        now = 0;
        jest.spyOn(Date, "now").mockImplementation(() => now);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Registers handler on topic and sends one request to it. The handler
    // takes elapsedMs per response.
    async function request(topic, responses, elapsedMs, payload = {}) {
        const wrapped = {
            setOnMessage: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            end: jest.fn(),
            publish: jest.fn(() => Promise.resolve()),
        };
        const client = new Client(wrapped, "device-1");
        client.handle(topic, async () => (async function* () {
            for (const response of responses) {
                now += elapsedMs;
                yield response;
            }
        })());
        const onMessage = wrapped.setOnMessage.mock.calls[0][0];
        onMessage(topic, Buffer.from(JSON.stringify(payload)), {
            topic,
            properties: {responseTopic: "_response/test", correlationData: "req-1"},
        });
        for (let i = 0; i < 20 && wrapped.publish.mock.calls.length < responses.length; i++) {
            await new Promise((resolve) => setImmediate(resolve));
        }
        expect(wrapped.publish).toHaveBeenCalledTimes(responses.length);
    }

    test("warns when a device operation misses its budget", async () => {
        await request("dab/device-1/applications/list", [{status: 200}], 300);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toMatch(/applications\/list answered in 300 ms, over its 250 ms/);
    });

    test("does not warn within the budget", async () => {
        await request("dab/device-1/applications/list", [{status: 200}], 250);
        expect(warn).not.toHaveBeenCalled();
    });

    test("uses the request durationMs for input/long-key-press", async () => {
        await request("dab/device-1/input/long-key-press", [{status: 200}], 1100, {keyCode: "KEY_OK", durationMs: 1000});
        expect(warn).not.toHaveBeenCalled();
    });

    test("checks only the first of a series of responses", async () => {
        await request("dab/device-1/system/logs/stop-collection",
            [{status: 200, remainingChunks: 1}, {status: 200, remainingChunks: 0}], 150);
        expect(warn).not.toHaveBeenCalled();
    });

    test.each(["dab/bridge/bridge-1/add-device", "dab/discovery"])("does not check %s", async (topic) => {
        await request(topic, [{status: 200}], 5000);
        expect(warn).not.toHaveBeenCalled();
    });
});
