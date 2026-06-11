/**
 * Keep the existing default request timeout for normal operations, and only
 * extend timeout for DAB 2.1 operations whose spec latency exceeds the default.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;

export const EXTENDED_OPERATION_TIMEOUT_MS = {
    "applications/list": 250,
    "applications/install": 60_000,
    "applications/uninstall": 10_000,
    "applications/install-from-app-store": 60_000,
    "system/factory-reset": 600_000
};

export function getRequestTimeoutMs(topic, options = {}) {
    if (typeof options.timeoutMs === "number") {
        return options.timeoutMs;
    }

    return EXTENDED_OPERATION_TIMEOUT_MS[topic] ?? DEFAULT_REQUEST_TIMEOUT_MS;
}
