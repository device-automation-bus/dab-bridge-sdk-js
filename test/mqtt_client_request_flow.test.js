import { jest } from "@jest/globals";
import { Client } from "../src/lib/mqtt_client/client.js";
import { TimeoutError } from "../src/lib/mqtt_client/error.js";

function createClient() {
  let onMessage;
  const wrapped = {
    setOnMessage: jest.fn((cb) => {
      onMessage = cb;
    }),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    end: jest.fn(),
    publish: jest.fn(() => Promise.resolve())
  };

  const client = new Client(wrapped, "device-1");

  return {
    client,
    wrapped,
    sendResponse(message, overrides = {}) {
      const [, , publishOptions] = wrapped.publish.mock.calls[0];
      onMessage(
        publishOptions.properties.responseTopic,
        Buffer.from(JSON.stringify(message)),
        {
          correlationData:
            overrides.correlationData ??
            publishOptions.properties.correlationData,
          properties: {
            correlationData:
              overrides.correlationData ??
              publishOptions.properties.correlationData
          }
        }
      );
    }
  };
}

describe("MQTT request and response flow", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("publishes a DAB request and resolves response", async () => {
    const { client, wrapped, sendResponse } = createClient();
    const requestPromise = client.request("health-check/get", {});

    await Promise.resolve();
    expect(wrapped.publish.mock.calls[0][0]).toBe(
      "dab/device-1/health-check/get"
    );
    expect(
      wrapped.publish.mock.calls[0][2].properties.responseTopic
    ).toMatch(/^_response\/dab\/device-1\/health-check\/get\//);

    sendResponse({ status: 200, healthy: true });
    await expect(requestPromise).resolves.toEqual({
      status: 200,
      healthy: true
    });
  });

  test("ignores responses with non matching correlation data", async () => {
    jest.useFakeTimers();

    const { client, sendResponse } = createClient();
    const requestPromise = client.request("health-check/get", {});

    await Promise.resolve();
    sendResponse({ status: 200, healthy: false }, {
      correlationData: "wrong-id"
    });
    jest.advanceTimersByTime(20_000);

    await expect(requestPromise).rejects.toBeInstanceOf(TimeoutError);
  });

  test("assembles stop collection chunks before resolving", async () => {
    const { client, sendResponse } = createClient();
    const requestPromise = client.request(
      "system/logs/stop-collection",
      {}
    );

    await Promise.resolve();
    sendResponse({ status: 200, logArchive: "chunk-a-", remainingChunks: 2 });
    sendResponse({ status: 200, logArchive: "chunk-b-", remainingChunks: 1 });
    sendResponse({ status: 200, logArchive: "chunk-c", remainingChunks: 0 });

    await expect(requestPromise).resolves.toEqual({
      status: 200,
      logArchive: "chunk-a-chunk-b-chunk-c",
      remainingChunks: 0
    });
  });

  test("rejects stop collection when a later chunk is an error", async () => {
    const { client, sendResponse } = createClient();
    const requestPromise = client.request(
      "system/logs/stop-collection",
      {}
    );

    await Promise.resolve();
    sendResponse({ status: 200, logArchive: "chunk-a-", remainingChunks: 1 });
    sendResponse({ status: 500, error: "log export failed" });

    await expect(requestPromise).rejects.toEqual({
      status: 500,
      error: "log export failed"
    });
  });

  test("rejects stop collection with broken chunk order", async () => {
    const { client, sendResponse } = createClient();
    const requestPromise = client.request(
      "system/logs/stop-collection",
      {}
    );

    await Promise.resolve();
    sendResponse({ status: 200, logArchive: "chunk-a-", remainingChunks: 2 });
    sendResponse({ status: 200, logArchive: "chunk-c", remainingChunks: 0 });

    await expect(requestPromise).rejects.toThrow(
      "Invalid stop-collection chunk sequence"
    );
  });

  test("times out when stop collection misses the final chunk", async () => {
    jest.useFakeTimers();

    const { client, sendResponse } = createClient();
    const requestPromise = client.request(
      "system/logs/stop-collection",
      {}
    );

    await Promise.resolve();
    sendResponse({ status: 200, logArchive: "chunk-a-", remainingChunks: 1 });
    jest.advanceTimersByTime(20_000);

    await expect(requestPromise).rejects.toThrow(
      "Failed to receive response from " +
      "system/logs/stop-collection within 20000ms"
    );
  });
});
