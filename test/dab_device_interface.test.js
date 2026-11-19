import { DabDeviceInterface } from "../src/interface/dab_device_interface.js";

class TestDevice extends DabDeviceInterface {}

describe("DabDeviceInterface.dabResponse()", () => {
  const device = new TestDevice("test-device");

  test("2xx response with data keeps status", () => {
    expect(device.dabResponse(200, { applications: [] })).toEqual({ status: 200, applications: [] });
  });

  test("2xx response without data only carries status", () => {
    expect(device.dabResponse()).toEqual({ status: 200 });
  });

  test("error response carries status and error", () => {
    expect(device.dabResponse(400, "Bad request")).toEqual({ status: 400, error: "Bad request" });
  });

  test("error response without a message throws", () => {
    expect(() => device.dabResponse(500)).toThrow("Error message must be returned");
  });
});
