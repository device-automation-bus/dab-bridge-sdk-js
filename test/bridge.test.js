const appRoot = require("app-root-path");
DabBridge = require(appRoot + "/src/bridge.js");

describe("Bridge functions", () => {
  bridgeID = "teste";
  device = "emulator";

  test("test add-device operation", async () => {
    bridge = new DabBridge(bridgeID, device);
    topic = "dab/bridge/" + bridgeID + "/add-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":200}');
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":500, "error":"IP already added"}');
  });

  test("test invalid operation", async () => {
    bridge = new DabBridge(bridgeID, device);
    topic = "dab/bridge/" + bridgeID + "/invalid-operation";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe(
      '{"status":501, "error":"The requested functionality is not implemented."}'
    );
  });

  test("test remove-device operation", async () => {
    bridge = new DabBridge(bridgeID, device);

    topic = "dab/bridge/" + bridgeID + "/add-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":200}');

    topic = "dab/bridge/" + bridgeID + "/remove-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":200}');

    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":501, "error":"Device not exists"}');
  });

  test("test list-devices operation", async () => {
    bridge = new DabBridge(bridgeID, device);

    topic = "dab/bridge/" + bridgeID + "/add-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":200}');

    topic = "dab/bridge/" + bridgeID + "/list-devices";
    message = "{ }";
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe(
      '{"status":200, "devices":[["dummyDeviceID","my.board.ip"]]}'
    );
  });

  test("test dab/applications/launch operation", async () => {
    bridge = new DabBridge(bridgeID, device);

    topic = "dab/bridge/" + bridgeID + "/add-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toBe('{"status":200}');

    topic = "dab/dummyDeviceID/applications/launch";
    message = '{ "appId": "Cobalt" }';
    response = await bridge.processMqttMessage(topic, message);
    expect(response).toStrictEqual({ status: 200 });
  });
});
