import { Client } from "../src/lib/mqtt_client/client.js";
import { jest } from "@jest/globals";

describe("Client.request", () => {
  test("resolves with the response whose MQTT 5 correlation data matches", async () => {
    let onMessage;
    const wrapped = {
      setOnMessage: jest.fn((cb) => { onMessage = cb; }),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      end: jest.fn(),
      publish: jest.fn(() => Promise.resolve()),
    };
    const client = new Client(wrapped, "device-1");
    const reqPromise = client.request("applications/list", {}, { qos: 1, timeoutMs: 1000 });

    const { responseTopic, correlationData } = wrapped.publish.mock.calls[0][2].properties;
    const deliver = (id, body) =>
      onMessage(responseTopic, Buffer.from(JSON.stringify(body)), {
        topic: responseTopic,
        properties: { correlationData: Buffer.from(id) },
      });

    deliver("other-request", { status: 200, applications: ["wrong"] });
    deliver(correlationData, { status: 200, applications: [] });

    await expect(reqPromise).resolves.toEqual({ status: 200, applications: [] });
  });
});
