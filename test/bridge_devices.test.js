import { jest } from "@jest/globals";
import { DabBridge } from "../src/bridge.js";
import { DabDeviceInterface } from "../src/interface/dab_device_interface.js";
import { PartnerDabDevice } from "../src/partner/partner_dab_device.js";

describe("DabBridge.addDevice() dabDeviceId validation", () => {
    beforeAll(() => {
        // Skip the MQTT connection made when a device is onboarded.
        jest.spyOn(DabDeviceInterface.prototype, "init").mockResolvedValue();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test.each(["Device1", "device.1", "device 1", ""])("rejects %p", async (dabDeviceId) => {
        const bridge = new DabBridge("test-bridge");
        const response = await bridge.addDevice({ip: "192.0.2.1", dabDeviceId});
        expect(response.status).toBe(400);
        expect(bridge.deviceMap.size).toBe(0);
    });

    test.each(["device-1", "dev_1", "0a1b2c"])("accepts %p", async (dabDeviceId) => {
        const bridge = new DabBridge("test-bridge");
        const response = await bridge.addDevice({ip: "192.0.2.1", dabDeviceId, skipValidation: true});
        expect(response).toEqual({status: 200, deviceId: dabDeviceId});
        expect(bridge.deviceMap.get("192.0.2.1").dabDeviceID).toBe(dabDeviceId);
    });
});

describe("PartnerDabDevice.discovery()", () => {
    test("returns status, ip and deviceId", async () => {
        const device = new PartnerDabDevice("test-device", "192.0.2.1");
        expect(await device.discovery()).toEqual({status: 200, ip: "192.0.2.1", deviceId: "test-device"});
    });
});
