import { Client } from "../src/lib/mqtt_client/client.js";
import { getRequestTimeoutMs } from "../src/interface/dab_operation_timeouts.js";
import { TimeoutError } from "../src/lib/mqtt_client/error.js";
import { jest } from "@jest/globals";

describe("DAB 2.1 request timeout behavior", () => {
  test("default timeout remains 20000 ms", () => {
    expect(getRequestTimeoutMs("system/network-reset")).toBe(20_000);
  });

  test("applications/list timeout is 250 ms", () => {
    expect(getRequestTimeoutMs("applications/list")).toBe(250);
  });

  test("applications/install timeout is 60000 ms", () => {
    expect(getRequestTimeoutMs("applications/install")).toBe(60_000);
  });

  test("applications/uninstall timeout is 10000 ms", () => {
    expect(getRequestTimeoutMs("applications/uninstall")).toBe(10_000);
  });

  test("applications/install-from-app-store timeout is 60000 ms", () => {
    expect(getRequestTimeoutMs("applications/install-from-app-store")).toBe(60_000);
  });

  test("system/factory-reset timeout is 600000 ms", () => {
    expect(getRequestTimeoutMs("system/factory-reset")).toBe(600_000);
  });

  test("system/network-reset uses default 20000 ms", () => {
    expect(getRequestTimeoutMs("system/network-reset")).toBe(20_000);
  });

  test("unknown operations use default 20000 ms", () => {
    expect(getRequestTimeoutMs("some/unknown-operation")).toBe(20_000);
  });

  test("options.timeoutMs overrides default and extended timeout", () => {
    expect(getRequestTimeoutMs("applications/install", { timeoutMs: 12_345 })).toBe(12_345);
    expect(getRequestTimeoutMs("applications/list", { timeoutMs: 54_321 })).toBe(54_321);
  });

  test("timeoutMs is stripped before mqtt.publish()", async () => {
    jest.useFakeTimers();

    const wrapped = {
      setOnMessage: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      end: jest.fn(),
      publish: jest.fn(() => Promise.resolve()),
    };
    const client = new Client(wrapped, "device-1");
    const reqPromise = client.request(
      "applications/install",
      { appId: "x", url: "http://example.com/app" },
      { qos: 1, timeoutMs: 98765 }
    );

    await Promise.resolve();
    expect(wrapped.publish).toHaveBeenCalledTimes(1);

    const publishOptions = wrapped.publish.mock.calls[0][2];
    expect(publishOptions.timeoutMs).toBeUndefined();
    expect(publishOptions.qos).toBe(1);

    jest.advanceTimersByTime(98765);
    await expect(reqPromise).rejects.toBeInstanceOf(TimeoutError);
    jest.useRealTimers();
  });

  test("TimeoutError message includes topic and selected timeout", async () => {
    jest.useFakeTimers();

    const wrapped = {
      setOnMessage: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      end: jest.fn(),
      publish: jest.fn(() => Promise.resolve()),
    };
    const client = new Client(wrapped, "device-1");
    const reqPromise = client.request("system/factory-reset");

    await Promise.resolve();
    jest.advanceTimersByTime(600000);
    await expect(reqPromise).rejects.toThrow("Failed to receive response from system/factory-reset within 600000ms");
    jest.useRealTimers();
  });
});
