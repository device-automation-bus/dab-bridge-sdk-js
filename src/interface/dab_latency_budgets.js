/**
 * Device side latency budgets from DAB 2.1 spec section 3.4: an operation must
 * complete within 200 ms unless the operation sets its own limit. These are
 * the limits a device or bridge must meet, not client side timeouts (see
 * dab_operation_timeouts.js).
 */
export const DEFAULT_LATENCY_BUDGET_MS = 200;

export const OPERATION_LATENCY_BUDGETS_MS = {
    "applications/list": 250,
    "applications/install": 60_000,
    "applications/install-from-app-store": 60_000,
    "applications/uninstall": 10_000,
    "system/factory-reset": 600_000,
    "output/image": 2_000,
    "app-telemetry/start": 700
};

/**
 * @param {string} operation - topic without the `dab/<deviceId>/` prefix
 * @param {Object} [request] - request payload
 * @returns {number} latency budget in milliseconds
 */
export function getLatencyBudgetMs(operation, request = {}) {
    if (operation === "input/long-key-press") {
        // 200 ms plus the duration of the key press
        return DEFAULT_LATENCY_BUDGET_MS + (Number.isFinite(request.durationMs) ? request.durationMs : 0);
    }

    return OPERATION_LATENCY_BUDGETS_MS[operation] ?? DEFAULT_LATENCY_BUDGET_MS;
}
