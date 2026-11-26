import { DabBridge } from "../src/bridge.js";

describe("DabBridge.addDevice() dabDeviceId validation", () => {
    const bridge = new DabBridge("test-bridge");

    test.each(["Device1", "device.1", "device 1", ""])("rejects %p", async (dabDeviceId) => {
        const response = await bridge.addDevice({ip: "192.0.2.1", dabDeviceId});
        expect(response.status).toBe(400);
        expect(bridge.deviceMap.size).toBe(0);
    });
});
