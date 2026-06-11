import {
  validateAppIdRequest,
  validateContentRecommendationsResponse,
  validateGetPowerModeResponse,
  validateOpenContentRequest,
  validateSearchContentRequest,
  validateSearchContentResponse,
  validateSystemSettingsGetResponse,
  validateSystemSettingsListResponse,
  validateSystemSettingsSetResponse,
  validateSystemSettingsSetRequest
} from "../src/interface/dab_validation.js";

describe("DAB 2.1 settings schema validation", () => {
  test("system/settings/list accepts DAB 2.1 supported settings response", () => {
    const response = {
      status: 200,
      outputResolution: [{ width: 1920, height: 1080, frequency: 60 }],
      brightness: { min: 0, max: 100 },
      contrast: { min: 0, max: 100 },
      timeZone: ["Europe/Helsinki", "UTC"],
      screenSaver: true,
      screenSaverMinTimeout: 10,
      personalizedAds: true,
      highContrastText: true,
      identifierForAdvertising: true
    };

    expect(validateSystemSettingsListResponse(response)).toBeNull();
  });

  test("system/settings/get accepts DAB 2.1 current values", () => {
    const response = {
      status: 200,
      outputResolution: { width: 1920, height: 1080, frequency: 60 },
      brightness: 50,
      contrast: 55,
      timeZone: "Europe/Helsinki",
      screenSaver: true,
      screenSaverTimeout: 120,
      personalizedAds: false,
      highContrastText: true,
      identifierForAdvertising: "8f3f6ee0-b7d5-4e11-a7c6-037fe4f5f0db"
    };

    expect(validateSystemSettingsGetResponse(response)).toBeNull();
  });

  test("system/settings/set accepts valid fields and value types", () => {
    const request = {
      outputResolution: { width: 1920, height: 1080, frequency: 60 },
      brightness: 80,
      contrast: 40,
      personalizedAds: true,
      highContrastText: false,
      screenSaver: true,
      screenSaverTimeout: 300,
      identifierForAdvertising: "38400000-8cf0-11bd-b23e-10b96e40000d"
    };

    expect(validateSystemSettingsSetRequest(request)).toBeNull();
  });

  test("system/settings/set rejects unknown setting names", () => {
    expect(validateSystemSettingsSetRequest({ unknownSetting: true })).toContain("Unsupported");
  });

  test("system/settings/set rejects invalid value types", () => {
    expect(validateSystemSettingsSetRequest({ brightness: "high" })).toContain("Invalid value");
  });

  test("error responses do not require success-only setting fields", () => {
    expect(validateSystemSettingsGetResponse({ status: 400, error: "bad request" })).toBeNull();
    expect(validateSystemSettingsListResponse({ status: 500, error: "internal" })).toBeNull();
  });

  test("system/settings/set response validates using current values shape", () => {
    const response = {
      status: 200,
      outputResolution: { width: 1920, height: 1080, frequency: 60 },
      brightness: 80
    };

    expect(validateSystemSettingsSetResponse(response)).toBeNull();
  });

  test("existing DAB 2.0 settings behavior remains backward compatible", () => {
    const legacyRequest = {
      language: "en-US",
      audioVolume: 12,
      mute: false
    };
    expect(validateSystemSettingsSetRequest(legacyRequest)).toBeNull();
  });
});

describe("DAB 2.1 content schema validation", () => {
  const validEntry = {
    entryId: "entry-1",
    appId: "YouTube",
    title: "My Video",
    poster: "data:image/png;base64,AAAA",
    categories: ["Video", "Trending"]
  };

  test("content/search request validates required fields", () => {
    expect(validateSearchContentRequest({ searchText: "home" })).toBeNull();
  });

  test("content/search rejects invalid request shape", () => {
    expect(validateSearchContentRequest({ query: "home" })).toContain("searchText");
  });

  test("content/search response validates entries array", () => {
    expect(validateSearchContentResponse({ status: 200, entries: [validEntry] })).toBeNull();
  });

  test("content/recommendations response validates entries array", () => {
    expect(validateContentRecommendationsResponse({ status: 200, entries: [validEntry] })).toBeNull();
  });

  test("content/open request validates required fields", () => {
    expect(validateOpenContentRequest({ entryId: "abc" })).toBeNull();
  });

  test("content/open rejects contentId without entryId", () => {
    expect(validateOpenContentRequest({ contentId: "abc" })).toContain("entryId");
  });

  test("invalid ContentEntry is rejected", () => {
    const invalidEntry = { ...validEntry };
    delete invalidEntry.poster;
    expect(validateSearchContentResponse({ status: 200, entries: [invalidEntry] })).toContain("poster");
  });

  test("invalid ContentCategory is rejected", () => {
    const invalidCategoryEntry = { ...validEntry, categories: ["NotRealCategory"] };
    expect(validateSearchContentResponse({ status: 200, entries: [invalidCategoryEntry] })).toContain("Unsupported content category");
  });

  test("error responses do not require entries", () => {
    expect(validateSearchContentResponse({ status: 400, error: "bad request" })).toBeNull();
    expect(validateContentRecommendationsResponse({ status: 500, error: "internal" })).toBeNull();
  });

  test("existing non-content operations are not affected", () => {
    expect(validateSystemSettingsSetRequest({ mute: true })).toBeNull();
  });

  test("app id requests require appId", () => {
    expect(validateAppIdRequest({ appId: "YouTube" }, "uninstallApp")).toBeNull();
    expect(validateAppIdRequest({}, "uninstallApp")).toContain("appId");
  });

  test("get power mode validates allowed response values", () => {
    expect(validateGetPowerModeResponse({ status: 200, powerMode: "Standby" })).toBeNull();
    expect(validateGetPowerModeResponse({ status: 200, powerMode: "Off" })).toContain("powerMode");
  });
});
