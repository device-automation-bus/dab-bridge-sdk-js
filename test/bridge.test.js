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

    // Since this is an invalid IP, we expect the partner health check to fail
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(400);

    // Now set skipValidation as true to skip past partner health check and just add device on demand
    message.skipValidation = true;
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    // Request to add a device with the same IP, we expect the bridge to reject this.
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(400);
  });

  test("test invalid operation", async () => {
    let bridge = new DabBridge(bridgeID, device);
    let topic = "dab/bridge/" + bridgeID + "/invalid-operation";
    let message = { ip: "my.board.ip", skipValidation: true};
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(501);
  });

  test("test remove-device operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip", skipValidation: true};
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = "dab/bridge/" + bridgeID + "/remove-device";
    message = { ip: "my.board.ip", skipValidation: true};
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(400); // device should not exist in map anymore
  });

  test("test list-devices operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip", skipValidation: true};
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = "dab/bridge/" + bridgeID + "/list-devices";
    message = {};
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);
  });

  test("test behavior with unsupported operations", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip", skipValidation: true};
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = `dab/${response.deviceId}/fake-operator`;
    message = {};
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response).toBe(null); // null is currently used to indicate that no response is needed everywhere
  });

  test("test dab/applications/launch operation", async () => {
    let bridge = new DabBridge(bridgeID, device);

    let topic = "dab/bridge/" + bridgeID + "/add-device";
    let message = { ip: "my.board.ip", skipValidation: true};
    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);

    topic = `dab/${response.deviceId}/applications/launch`;
    message = '{ "appId": "Cobalt" }';
    response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(501);
  });

  test("test version operation", async () => {
    let bridge = new DabBridge(bridgeID, device);
    let topic = "dab/bridge/" + bridgeID + "/version";
    let message = {};

    let response = await bridge.processMqttMessage(topic, JSON.stringify(message), mockMqttClient);
    expect(response.status).toBe(200);
    expect(response.version).toBe(process.env.npm_package_version);
  });


});
