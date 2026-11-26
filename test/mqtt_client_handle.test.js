import { jest } from "@jest/globals";
import { Client } from "../src/lib/mqtt_client/client.js";

const REQUEST_TOPIC = "dab/device-1/system/logs/stop-collection";
const RESPONSE_TOPIC = "_response/dab/device-1/system/logs/stop-collection/req-1";

function setup(handler) {
    const wrapped = {
        setOnMessage: jest.fn(),
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
        end: jest.fn(),
        publish: jest.fn(() => Promise.resolve()),
    };
    const client = new Client(wrapped, "device-1");
    client.handle(REQUEST_TOPIC, handler);
    const onMessage = wrapped.setOnMessage.mock.calls[0][0];
    const sendRequest = () => onMessage(REQUEST_TOPIC, Buffer.from("{}"), {
        topic: REQUEST_TOPIC,
        properties: {responseTopic: RESPONSE_TOPIC, correlationData: "req-1"},
    });
    return {wrapped, sendRequest};
}

async function waitForPublishes(wrapped, count) {
    for (let i = 0; i < 20 && wrapped.publish.mock.calls.length < count; i++) {
        await new Promise((resolve) => setImmediate(resolve));
    }
}

const chunks = [
    {status: 200, logArchive: "part1", remainingChunks: 2},
    {status: 200, logArchive: "part2", remainingChunks: 1},
    {status: 200, logArchive: "part3", remainingChunks: 0},
];

function expectPublished(wrapped, responses) {
    expect(wrapped.publish).toHaveBeenCalledTimes(responses.length);
    responses.forEach((response, i) => {
        const [topic, payload, options] = wrapped.publish.mock.calls[i];
        expect(topic).toBe(RESPONSE_TOPIC);
        expect(payload).toEqual(response);
        expect(options.properties.correlationData).toBe("req-1");
    });
}

describe("Client.handle() responses", () => {
    test("single response is published once", async () => {
        const {wrapped, sendRequest} = setup(async () => ({status: 200}));
        sendRequest();
        await waitForPublishes(wrapped, 1);
        expectPublished(wrapped, [{status: 200}]);
    });

    test("array is published as one response per element, in order", async () => {
        const {wrapped, sendRequest} = setup(async () => chunks);
        sendRequest();
        await waitForPublishes(wrapped, chunks.length);
        expectPublished(wrapped, chunks);
    });

    test("async iterable is published as one response per item, in order", async () => {
        const {wrapped, sendRequest} = setup(async () => (async function* () {
            yield* chunks;
        })());
        sendRequest();
        await waitForPublishes(wrapped, chunks.length);
        expectPublished(wrapped, chunks);
    });

    test("error while iterating publishes an error response", async () => {
        const {wrapped, sendRequest} = setup(async () => (async function* () {
            yield chunks[0];
            throw {status: 500, message: "archive failed"};
        })());
        sendRequest();
        await waitForPublishes(wrapped, 2);
        expect(wrapped.publish).toHaveBeenCalledTimes(2);
        expect(wrapped.publish.mock.calls[0][1]).toEqual(chunks[0]);
        expect(wrapped.publish.mock.calls[1][1].status).toBe(500);
    });
});
