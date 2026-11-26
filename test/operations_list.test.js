import { jest } from "@jest/globals";
import { DabDeviceInterface } from "../src/interface/dab_device_interface.js";
import { MqttClient } from "../src/lib/mqtt_client/index.js";
import { PartnerDabDevice } from "../src/partner/partner_dab_device.js";
import * as topics from "../src/interface/dab_topics.js";

class TestDevice extends DabDeviceInterface {}

describe("operations/list default", () => {
    let handleSpy;

    beforeAll(() => {
        // Register the handlers without connecting to a broker.
        jest.spyOn(MqttClient.prototype, "init").mockResolvedValue();
        jest.spyOn(DabDeviceInterface.prototype, "notify").mockResolvedValue();
        handleSpy = jest.spyOn(MqttClient.prototype, "handle");
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        handleSpy.mockClear();
    });

    async function requestOperations(device) {
        await device.init("mqtt://localhost:1883");
        const [, handler] = handleSpy.mock.calls.find(
            ([path]) => path === `dab/${device.dabDeviceID}/${topics.LIST_SUPPORTED_DAB_OPERATIONS_TOPIC}`
        );
        return handler({});
    }

    test("lists the registered device operations", async () => {
        const response = await requestOperations(new TestDevice("device-1"));
        expect(response.status).toBe(200);
        expect(response.operations).toEqual(expect.arrayContaining([
            topics.APPLICATIONS_LIST_TOPIC,
            topics.SYSTEM_LOGS_STOP_COLLECTION_TOPIC,
            topics.VOICE_SET_TOPIC,
            topics.DAB_VERSION_TOPIC,
        ]));
    });

    test("does not list operations/list itself or topics outside the device", async () => {
        const response = await requestOperations(new TestDevice("device-1"));
        expect(response.operations).not.toContain(topics.LIST_SUPPORTED_DAB_OPERATIONS_TOPIC);
        expect(response.operations).not.toContain(topics.DISCOVERY);
        expect(response.operations.every((operation) => !operation.startsWith("dab/"))).toBe(true);
    });

    test("partner stub returns the default list", async () => {
        const response = await requestOperations(new PartnerDabDevice("device-1", "192.0.2.1"));
        expect(response.status).toBe(200);
        expect(response.operations).toContain(topics.APPLICATIONS_LIST_TOPIC);
    });
});
