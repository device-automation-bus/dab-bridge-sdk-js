import { jest } from "@jest/globals";
import { DabClient } from "../src/interface/dab_client.js";
import * as topics from "../src/interface/dab_topics.js";

describe("DabClient DAB 2.1 public surface", () => {
  function createClient() {
    const mqtt = {
      request: jest.fn(async (topic, payload) => ({ topic, payload })),
      subscribe: jest.fn(),
      subscribeOnce: jest.fn(),
      discovery: jest.fn()
    };

    return { dabClient: new DabClient(mqtt), mqtt };
  }

  test("routes DAB 2.1 application methods to topics", async () => {
    const { dabClient, mqtt } = createClient();

    await dabClient.installApp(
      "YouTube",
      "http://example.com/app.pkg",
      "pkg",
      60000
    );
    await dabClient.uninstallApp("YouTube");
    await dabClient.clearAppData("YouTube");
    await dabClient.installAppFromStore("YouTube", "default-store");

    expect(mqtt.request).toHaveBeenNthCalledWith(
      1,
      topics.APPLICATIONS_INSTALL_TOPIC,
      {
        appId: "YouTube",
        url: "http://example.com/app.pkg",
        format: "pkg",
        timeout: 60000
      }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      2,
      topics.APPLICATIONS_UNINSTALL_TOPIC,
      { appId: "YouTube" }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      3,
      topics.APPLICATIONS_CLEAR_DATA_TOPIC,
      { appId: "YouTube" }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      4,
      topics.APPLICATIONS_INSTALL_FROM_APP_STORE_TOPIC,
      {
        appId: "YouTube",
        appStoreId: "default-store"
      }
    );
  });

  test("routes DAB 2.1 system methods to topics", async () => {
    const { dabClient, mqtt } = createClient();

    await dabClient.getPowerMode();
    await dabClient.setPowerMode("Standby");
    await dabClient.factoryReset();
    await dabClient.networkReset();
    await dabClient.startSystemLogCollection();
    await dabClient.stopSystemLogCollection();

    expect(mqtt.request).toHaveBeenNthCalledWith(
      1,
      topics.SYSTEM_POWER_MODE_GET_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      2,
      topics.SYSTEM_POWER_MODE_SET_TOPIC,
      { powerMode: "Standby" }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      3,
      topics.SYSTEM_FACTORY_RESET_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      4,
      topics.SYSTEM_NETWORK_RESET_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      5,
      topics.SYSTEM_LOGS_START_COLLECTION_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      6,
      topics.SYSTEM_LOGS_STOP_COLLECTION_TOPIC
    );
  });

  test("routes DAB 2.1 settings and content methods", async () => {
    const { dabClient, mqtt } = createClient();

    await dabClient.getSettings();
    await dabClient.setSettings({ brightness: 50 });
    await dabClient.searchContent("home");
    await dabClient.listContentRecommendations();
    await dabClient.openContent("entry-1");

    expect(mqtt.request).toHaveBeenNthCalledWith(
      1,
      topics.SYSTEM_SETTING_GET_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      2,
      topics.SYSTEM_SETTING_SET_TOPIC,
      { brightness: 50 }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      3,
      topics.CONTENT_SEARCH_TOPIC,
      { searchText: "home" }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      4,
      topics.CONTENT_RECOMMENDATIONS_TOPIC
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      5,
      topics.CONTENT_OPEN_TOPIC,
      { entryId: "entry-1" }
    );
  });

  test("uses spec field names for telemetry requests", async () => {
    const { dabClient, mqtt } = createClient();

    await dabClient.startDeviceTelemetry(1000);
    await dabClient.startAppTelemetry("YouTube", 2000);
    await dabClient.stopAppTelemetry("YouTube");

    expect(mqtt.request).toHaveBeenNthCalledWith(
      1,
      topics.DEVICE_TELEMETRY_START_TOPIC,
      { duration: 1000 }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      2,
      topics.APP_TELEMETRY_START_TOPIC,
      { appId: "YouTube", duration: 2000 }
    );
    expect(mqtt.request).toHaveBeenNthCalledWith(
      3,
      topics.APP_TELEMETRY_STOP_TOPIC,
      { appId: "YouTube" }
    );
  });
});
