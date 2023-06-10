const appRoot = require("app-root-path");
DabBridge = require(appRoot + "/src/bridge.js");

const mockMqttClient = {
  subscribe: jest.fn(),
  publish: jest.fn()
}

describe("Test Bridge Device Management Functions", () => {
  bridgeID = "dab-bridge";
  device = "template";

  test("test add-device operation", async () => {
    let bridge = new DabBridge(bridgeID, device);
    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip : "my.board.ip" };
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(400);
  });

  test("test invalid operation", async () => {
    let bridge = new DabBridge(bridgeID, device);
    let topic = "dab/bridge/" + bridgeID + "/invalid-operation";
    let message = { ip: "my.board.ip" };
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(501);
  });

  test("test remove-device operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip" };
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = "dab/bridge/" + bridgeID + "/remove-device";
    message = { ip: "my.board.ip" };
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(400); // device should not exist in map anymore
  });

  test("test list-devices operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip" };
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = "dab/bridge/" + bridgeID + "/list-devices";
    message = {};
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);
  });

  test("test dab/applications/launch operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip" };
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = `dab/${response.deviceId}/applications/launch`;
    message = '{ "appId": "Cobalt" }';
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(501);
  });
});
