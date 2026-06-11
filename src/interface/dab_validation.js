const CONTENT_CATEGORIES = new Set([
    "ContinueWatching",
    "Movies",
    "TvShows",
    "LiveEvents",
    "LinearTv",
    "Video",
    "Trending",
    "Others"
]);

const POWER_MODES = new Set(["Active", "Standby", "Deep Sleep"]);

const SYSTEM_SETTING_VALIDATORS = {
    language: (value) => typeof value === "string" && value.length > 0,
    outputResolution: isOutputResolution,
    memc: (value) => typeof value === "boolean",
    cec: (value) => typeof value === "boolean",
    lowLatencyMode: (value) => typeof value === "boolean",
    matchContentFrameRate: (value) => typeof value === "string" && value.length > 0,
    hdrOutputMode: (value) => typeof value === "string" && value.length > 0,
    pictureMode: (value) => typeof value === "string" && value.length > 0,
    audioOutputMode: (value) => typeof value === "string" && value.length > 0,
    audioOutputSource: (value) => typeof value === "string" && value.length > 0,
    videoInputSource: (value) => typeof value === "string" && value.length > 0,
    audioVolume: (value) => Number.isInteger(value),
    mute: (value) => typeof value === "boolean",
    timeZone: (value) => typeof value === "string" && value.length > 0,
    textToSpeech: (value) => typeof value === "boolean",
    brightness: (value) => Number.isInteger(value),
    contrast: (value) => Number.isInteger(value),
    screenSaver: (value) => typeof value === "boolean",
    screenSaverTimeout: (value) => Number.isInteger(value),
    personalizedAds: (value) => typeof value === "boolean",
    highContrastText: (value) => typeof value === "boolean",
    identifierForAdvertising: hasText
};

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOutputResolution(value) {
    return isObject(value) &&
        Number.isInteger(value.width) &&
        Number.isInteger(value.height) &&
        Number.isInteger(value.frequency);
}

function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isRange(value) {
    return isObject(value) && Number.isInteger(value.min) && Number.isInteger(value.max);
}

export function validateDabResponse(response) {
    if (!isObject(response)) return "response must be an object";
    if (typeof response.status !== "number") return "response.status must be a number";
    if (Math.floor(response.status / 100) !== 2 && "error" in response && typeof response.error !== "string") {
        return "response.error must be a string when provided";
    }
    return null;
}

export function validateInstallAppRequest(data) {
    if (!isObject(data)) return "installApp request must be an object";
    if (!hasText(data.appId)) return "installApp.appId must be a non-empty string";
    if (!hasText(data.url)) return "installApp.url must be a non-empty string";
    if (data.format !== undefined && !hasText(data.format)) {
        return "installApp.format must be a non-empty string when provided";
    }
    if (data.timeout !== undefined && (!Number.isInteger(data.timeout) || data.timeout < 0)) {
        return "installApp.timeout must be a non-negative integer when provided";
    }
    return null;
}

export function validateInstallAppFromStoreRequest(data) {
    if (!isObject(data)) return "installAppFromStore request must be an object";
    if (!hasText(data.appId)) return "installAppFromStore.appId must be a non-empty string";
    if (data.appStoreId !== undefined && !hasText(data.appStoreId)) {
        return "installAppFromStore.appStoreId must be a non-empty string when provided";
    }
    return null;
}

export function validateAppIdRequest(data, operation) {
    if (!isObject(data)) return `${operation} request must be an object`;
    if (!hasText(data.appId)) {
        return `${operation}.appId must be a non-empty string`;
    }
    return null;
}

export function validateSetPowerModeRequest(data) {
    if (!isObject(data)) return "setPowerMode request must be an object";
    if (!POWER_MODES.has(data.powerMode)) {
        return `setPowerMode.powerMode must be one of: ${Array.from(POWER_MODES).join(", ")}`;
    }
    return null;
}

export function validatePowerModeResponse(data, operation) {
    if (!isObject(data)) return `${operation} response must be an object`;
    if (typeof data.status !== "number") {
        return `${operation} response.status must be a number`;
    }
    if (Math.floor(data.status / 100) === 2 && !POWER_MODES.has(data.powerMode)) {
        return `${operation} response.powerMode must be one of: ${Array.from(POWER_MODES).join(", ")}`;
    }
    return null;
}

export function validateGetPowerModeResponse(data) {
    return validatePowerModeResponse(data, "getPowerMode");
}

export function validateSetPowerModeResponse(data) {
    return validatePowerModeResponse(data, "setPowerMode");
}

export function validateSystemSettingsSetRequest(data) {
    if (!isObject(data)) return "setSystemSettings request must be an object";

    const keys = Object.keys(data);
    if (keys.length === 0) return "setSystemSettings request cannot be empty";

    for (const key of keys) {
        const validator = SYSTEM_SETTING_VALIDATORS[key];
        if (!validator) return `Unsupported system setting key: ${key}`;
        if (!validator(data[key])) {
            return `Invalid value for setting '${key}'`;
        }
    }

    return null;
}

export const validateSetSystemSettingsRequest =
    validateSystemSettingsSetRequest;

export function validateSystemSettingsGetResponse(response) {
    const commonError = validateDabResponse(response);
    if (commonError) return commonError;
    if (Math.floor(response.status / 100) !== 2) return null;

    for (const [key, validator] of Object.entries(SYSTEM_SETTING_VALIDATORS)) {
        if (key in response && !validator(response[key])) {
            return `Invalid value type for system setting '${key}'`;
        }
    }

    return null;
}

export function validateSystemSettingsListResponse(response) {
    const commonError = validateDabResponse(response);
    if (commonError) return commonError;
    if (Math.floor(response.status / 100) !== 2) return null;

    const capabilityValidators = {
        language: isStringArray,
        outputResolution: (value) =>
            Array.isArray(value) && value.every(isOutputResolution),
        memc: (value) => typeof value === "boolean",
        cec: (value) => typeof value === "boolean",
        lowLatencyMode: (value) => typeof value === "boolean",
        matchContentFrameRate: isStringArray,
        hdrOutputMode: isStringArray,
        pictureMode: isStringArray,
        audioOutputMode: isStringArray,
        audioOutputSource: isStringArray,
        videoInputSource: isStringArray,
        audioVolume: isRange,
        mute: (value) => typeof value === "boolean",
        timeZone: isStringArray,
        textToSpeech: (value) => typeof value === "boolean",
        brightness: isRange,
        contrast: isRange,
        screenSaver: (value) => typeof value === "boolean",
        screenSaverMinTimeout: Number.isInteger,
        personalizedAds: (value) => typeof value === "boolean",
        highContrastText: (value) => typeof value === "boolean",
        identifierForAdvertising: (value) => typeof value === "boolean"
    };

    for (const [key, value] of Object.entries(response)) {
        if (key === "status" || key === "error") continue;

        const validator = capabilityValidators[key];
        if (!validator) return `Unsupported settings capability key: ${key}`;
        if (!validator(value)) return `Invalid capability value for '${key}'`;
    }

    return null;
}

export function validateSystemSettingsSetResponse(response) {
    return validateSystemSettingsGetResponse(response);
}

export function validateSearchContentRequest(data) {
    if (!isObject(data)) return "searchContent request must be an object";
    if (!hasText(data.searchText)) return "searchContent.searchText must be a non-empty string";
    return null;
}

function validateContentEntry(entry) {
    if (!isObject(entry)) return "content entry must be an object";
    if (!hasText(entry.entryId)) return "content entry.entryId must be a non-empty string";
    if (!hasText(entry.appId)) return "content entry.appId must be a non-empty string";
    if (!hasText(entry.title)) return "content entry.title must be a non-empty string";
    if (!hasText(entry.poster)) return "content entry.poster must be a non-empty string";
    if (!Array.isArray(entry.categories)) return "content entry.categories must be an array";

    for (const category of entry.categories) {
        if (!CONTENT_CATEGORIES.has(category)) {
            return `Unsupported content category '${category}'`;
        }
    }

    return null;
}

export function validateContentEntriesResponse(response, operationName) {
    const commonError = validateDabResponse(response);
    if (commonError) return commonError;
    if (Math.floor(response.status / 100) !== 2) return null;
    if (!Array.isArray(response.entries)) return `${operationName} response.entries must be an array`;

    for (const entry of response.entries) {
        const entryError = validateContentEntry(entry);
        if (entryError) return `${operationName} ${entryError}`;
    }

    return null;
}

export function validateSearchContentResponse(response) {
    return validateContentEntriesResponse(response, "searchContent");
}

export function validateContentRecommendationsResponse(response) {
    return validateContentEntriesResponse(response, "contentRecommendations");
}

export function validateOpenContentRequest(data) {
    if (!isObject(data)) return "openContent request must be an object";
    if (!hasText(data.entryId)) {
        return "openContent.entryId must be a non-empty string";
    }
    return null;
}

export function validateDeviceInfoResponse(data) {
    if (!isObject(data)) return "deviceInfo response must be an object";
    if (typeof data.status !== "number") return "deviceInfo response.status must be a number";
    if (Math.floor(data.status / 100) !== 2) return null;

    if (
        "identifierForAdvertising" in data &&
        data.identifierForAdvertising !== null &&
        !hasText(data.identifierForAdvertising)
    ) {
        return "deviceInfo.identifierForAdvertising must be a non-empty string when provided";
    }

    return null;
}

export { CONTENT_CATEGORIES };
