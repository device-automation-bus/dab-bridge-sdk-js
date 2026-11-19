import { DabBridge } from "../src/bridge.js";

describe("DabBridge.listDevices", () => {
  test("lists each onboarded device with its ip and deviceId", async () => {
    const bridge = new DabBridge("test-bridge");
    bridge.deviceMap.set("192.168.0.10", { dabDeviceID: "device-1" });

    const response = await bridge.listDevices({});

    expect(response).toEqual({
      status: 200,
      deviceList: [{ ip: "192.168.0.10", deviceId: "device-1" }],
    });
  });
});
