import { jest } from "@jest/globals";
import * as topics from "../src/interface/dab_topics.js";

const mqttInstances = [];

jest.unstable_mockModule("../src/lib/mqtt_client/index.js", () => ({
  MqttClient: class {
    constructor() {
      this.handlers = new Map();
      this.init = jest.fn(async () => this);
      this.publish = jest.fn(async () => ({ status: 200 }));
      mqttInstances.push(this);
    }

    handle(topic, handler) {
      this.handlers.set(topic, handler);
    }
  }
}));

const { DabDeviceInterface } =
  await import("../src/interface/dab_device_interface.js");

class MockDabDevice extends DabDeviceInterface {
  async listSupportedOperations() {
    return { status: 200, operations: ["content/search"] };
  }

  async searchContent() {
    return {
      status: 200,
      entries: [{
        entryId: "entry-1",
        appId: "YouTube",
        title: "Home",
        poster: "data:image/png;base64,AAAA",
        categories: ["Video"]
      }]
    };
  }

  async setSystemSettings(data) {
    return { status: 200, ...data };
  }

  async getPowerMode() {
    return { status: 200, powerMode: "Standby" };
  }
}

describe("DabDeviceInterface DAB 2.1 registration", () => {
  beforeEach(() => {
    mqttInstances.length = 0;
  });

  test("registers all expected DAB 2.1 topics", async () => {
    const device = new MockDabDevice("device-1");
    await device.init("mqtt://broker");
    const registeredTopics = mqttInstances[0].handlers;

    const expectedTopicSuffixes = [
      topics.APPLICATIONS_INSTALL_TOPIC,
      topics.APPLICATIONS_UNINSTALL_TOPIC,
      topics.APPLICATIONS_CLEAR_DATA_TOPIC,
      topics.APPLICATIONS_INSTALL_FROM_APP_STORE_TOPIC,
      topics.SYSTEM_POWER_MODE_GET_TOPIC,
      topics.SYSTEM_POWER_MODE_SET_TOPIC,
      topics.SYSTEM_FACTORY_RESET_TOPIC,
      topics.SYSTEM_NETWORK_RESET_TOPIC,
      topics.SYSTEM_LOGS_START_COLLECTION_TOPIC,
      topics.SYSTEM_LOGS_STOP_COLLECTION_TOPIC,
      topics.SYSTEM_SETTING_LIST_TOPIC,
      topics.SYSTEM_SETTING_GET_TOPIC,
      topics.SYSTEM_SETTING_SET_TOPIC,
      topics.CONTENT_SEARCH_TOPIC,
      topics.CONTENT_RECOMMENDATIONS_TOPIC,
      topics.CONTENT_OPEN_TOPIC,
      topics.VOICE_LIST_TOPIC,
      topics.VOICE_SET_TOPIC,
      topics.SEND_TEXT_TO_VOICE_SYSTEM_TOPIC,
      topics.SEND_AUDIO_TO_VOICE_SYSTEM_TOPIC,
      topics.DAB_VERSION_TOPIC
    ];

    for (const suffix of expectedTopicSuffixes) {
      expect(registeredTopics.has(`dab/device-1/${suffix}`)).toBe(true);
    }
  });

  test("reports DAB 2.1 version support", () => {
    const device = new MockDabDevice("device-1");
    expect(device.version()).toEqual({
      status: 200,
      versions: ["2.0", "2.1"]
    });
  });

  test("applies SDK validation to registered handlers", async () => {
    const device = new MockDabDevice("device-1");
    await device.init("mqtt://broker");
    const registeredTopics = mqttInstances[0].handlers;

    const searchHandler = registeredTopics.get(
      `dab/device-1/${topics.CONTENT_SEARCH_TOPIC}`
    );
    const invalidSearch = await searchHandler({});
    const validSearch = await searchHandler({ searchText: "home" });

    expect(invalidSearch.status).toBe(400);
    expect(validSearch.status).toBe(200);
    expect(validSearch.entries).toHaveLength(1);
  });

  test("validates new app id and power mode handlers", async () => {
    const device = new MockDabDevice("device-1");
    await device.init("mqtt://broker");
    const registeredTopics = mqttInstances[0].handlers;

    const uninstallHandler = registeredTopics.get(
      `dab/device-1/${topics.APPLICATIONS_UNINSTALL_TOPIC}`
    );
    const powerModeHandler = registeredTopics.get(
      `dab/device-1/${topics.SYSTEM_POWER_MODE_GET_TOPIC}`
    );

    const invalidUninstall = await uninstallHandler({});
    const validPowerMode = await powerModeHandler({});

    expect(invalidUninstall.status).toBe(400);
    expect(validPowerMode).toEqual({
      status: 200,
      powerMode: "Standby"
    });
  });
});
