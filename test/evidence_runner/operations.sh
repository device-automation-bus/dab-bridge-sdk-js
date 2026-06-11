#!/usr/bin/env bash

OPERATIONS=()

register_operation() {
    local name="$1"
    local topic="$2"
    local payload="$3"
    local wait_seconds="$4"
    local mode="${5:-single}"

    OPERATIONS+=("${name}|${topic}|${payload}|${wait_seconds}|${mode}")
}

load_operations() {
    register_operation "bridge_add_device" \
        "dab/bridge/$BRIDGE_ID/add-device" \
        "{ \"ip\": \"$DEVICE_IP\", \"skipValidation\": true, \"dabDeviceId\": \"$DEVICE_ID\" }" \
        "$WAIT_MEDIUM"

    register_operation "bridge_list_devices" \
        "dab/bridge/$BRIDGE_ID/list-devices" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "discovery" \
        "dab/discovery" \
        "{}" \
        "$WAIT_SHORT" \
        "multi"

    register_operation "operations_list" \
        "dab/$DEVICE_ID/operations/list" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "version" \
        "dab/$DEVICE_ID/version" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "device_info" \
        "dab/$DEVICE_ID/device/info" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "health_check" \
        "dab/$DEVICE_ID/health-check/get" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "applications_list" \
        "dab/$DEVICE_ID/applications/list" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "applications_launch" \
        "dab/$DEVICE_ID/applications/launch" \
        '{ "appId": "YouTube" }' \
        "$WAIT_SHORT"

    register_operation "applications_launch_with_content" \
        "dab/$DEVICE_ID/applications/launch-with-content" \
        '{ "appId": "YouTube", "contentId": "demo-content" }' \
        "$WAIT_SHORT"

    register_operation "applications_get_state" \
        "dab/$DEVICE_ID/applications/get-state" \
        '{ "appId": "YouTube" }' \
        "$WAIT_SHORT"

    register_operation "applications_exit" \
        "dab/$DEVICE_ID/applications/exit" \
        '{ "appId": "YouTube" }' \
        "$WAIT_SHORT"

    register_operation "applications_install" \
        "dab/$DEVICE_ID/applications/install" \
        '{ "appId": "YouTube", "url": "https://example.com/app.pkg" }' \
        "$WAIT_LONG"

    register_operation "applications_uninstall" \
        "dab/$DEVICE_ID/applications/uninstall" \
        '{ "appId": "YouTube" }' \
        "$WAIT_MEDIUM"

    register_operation "applications_clear_data" \
        "dab/$DEVICE_ID/applications/clear-data" \
        '{ "appId": "YouTube" }' \
        "$WAIT_MEDIUM"

    register_operation "applications_install_from_app_store" \
        "dab/$DEVICE_ID/applications/install-from-app-store" \
        '{ "appId": "YouTube", "appStoreId": "store-id" }' \
        "$WAIT_LONG"

    register_operation "system_restart" \
        "dab/$DEVICE_ID/system/restart" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "system_power_mode_get" \
        "dab/$DEVICE_ID/system/power-mode/get" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "system_power_mode_set" \
        "dab/$DEVICE_ID/system/power-mode/set" \
        '{ "powerMode": "Standby" }' \
        "$WAIT_SHORT"

    register_operation "system_factory_reset" \
        "dab/$DEVICE_ID/system/factory-reset" \
        "{}" \
        "$WAIT_LONG"

    register_operation "system_network_reset" \
        "dab/$DEVICE_ID/system/network-reset" \
        "{}" \
        "$WAIT_MEDIUM"

    register_operation "system_settings_list" \
        "dab/$DEVICE_ID/system/settings/list" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "system_settings_get" \
        "dab/$DEVICE_ID/system/settings/get" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "system_settings_set" \
        "dab/$DEVICE_ID/system/settings/set" \
        '{ "brightness": 50, "screenSaver": true }' \
        "$WAIT_SHORT"

    register_operation "system_logs_start_collection" \
        "dab/$DEVICE_ID/system/logs/start-collection" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "system_logs_stop_collection" \
        "dab/$DEVICE_ID/system/logs/stop-collection" \
        "{}" \
        "$WAIT_MEDIUM" \
        "multi"

    register_operation "input_key_list" \
        "dab/$DEVICE_ID/input/key/list" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "input_key_press" \
        "dab/$DEVICE_ID/input/key-press" \
        '{ "keyCode": "KEY_HOME" }' \
        "$WAIT_SHORT"

    register_operation "input_long_key_press" \
        "dab/$DEVICE_ID/input/long-key-press" \
        '{ "keyCode": "KEY_BACK", "durationMs": 2000 }' \
        "$WAIT_SHORT"

    register_operation "output_image" \
        "dab/$DEVICE_ID/output/image" \
        '{ "outputLocation": "http://127.0.0.1/image.png" }' \
        "$WAIT_SHORT"

    register_operation "content_search" \
        "dab/$DEVICE_ID/content/search" \
        '{ "searchText": "home" }' \
        "$WAIT_SHORT"

    register_operation "content_recommendations" \
        "dab/$DEVICE_ID/content/recommendations" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "content_open" \
        "dab/$DEVICE_ID/content/open" \
        '{ "entryId": "entry-1" }' \
        "$WAIT_SHORT"

    register_operation "device_telemetry_start" \
        "dab/$DEVICE_ID/device-telemetry/start" \
        '{ "duration": 1000 }' \
        "$WAIT_SHORT"

    register_operation "device_telemetry_stop" \
        "dab/$DEVICE_ID/device-telemetry/stop" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "app_telemetry_start" \
        "dab/$DEVICE_ID/app-telemetry/start" \
        '{ "appId": "YouTube", "duration": 1000 }' \
        "$WAIT_SHORT"

    register_operation "app_telemetry_stop" \
        "dab/$DEVICE_ID/app-telemetry/stop" \
        '{ "appId": "YouTube" }' \
        "$WAIT_SHORT"

    register_operation "voice_list" \
        "dab/$DEVICE_ID/voice/list" \
        "{}" \
        "$WAIT_SHORT"

    register_operation "voice_set" \
        "dab/$DEVICE_ID/voice/set" \
        '{ "voiceSystem": { "name": "AmazonAlexa", "enabled": true } }' \
        "$WAIT_SHORT"

    register_operation "voice_send_text" \
        "dab/$DEVICE_ID/voice/send-text" \
        '{ "requestText": "Play music", "voiceSystem": "AmazonAlexa" }' \
        "$WAIT_SHORT"

    register_operation "voice_send_audio" \
        "dab/$DEVICE_ID/voice/send-audio" \
        '{ "fileLocation": "http://127.0.0.1/test.wav", "voiceSystem": "AmazonAlexa" }' \
        "$WAIT_SHORT"

    register_operation "bridge_remove_device" \
        "dab/bridge/$BRIDGE_ID/remove-device" \
        "{ \"ip\": \"$DEVICE_IP\" }" \
        "$WAIT_MEDIUM"
}
