/**
 Copyright 2023 Amazon.com, Inc. or its affiliates.
 Copyright 2023 Netflix Inc.
 Copyright 2023 Google LLC
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

export const LIST_SUPPORTED_DAB_OPERATIONS_TOPIC = "operations/list";

export const APPLICATIONS_LIST_TOPIC = "applications/list";
export const APPLICATIONS_LAUNCH_TOPIC = "applications/launch";
export const APPLICATIONS_LAUNCH_WITH_CONTENT_TOPIC = "applications/launch-with-content";
export const APPLICATIONS_GET_STATE_TOPIC = "applications/get-state";
export const APPLICATIONS_EXIT_TOPIC = "applications/exit";
export const APPLICATIONS_INSTALL_TOPIC = "applications/install";
export const APPLICATIONS_UNINSTALL_TOPIC = "applications/uninstall";
export const APPLICATIONS_CLEAR_DATA_TOPIC = "applications/clear-data";
export const APPLICATIONS_INSTALL_FROM_APP_STORE_TOPIC = "applications/install-from-app-store";

export const SYSTEM_RESTART_TOPIC = "system/restart";
export const SYSTEM_SETTING_LIST_TOPIC = "system/settings/list";
export const SYSTEM_SETTING_SET_TOPIC = "system/settings/set";
export const SYSTEM_SETTING_GET_TOPIC = "system/settings/get";
export const SYSTEM_POWER_MODE_GET_TOPIC = "system/power-mode/get";
export const SYSTEM_POWER_MODE_SET_TOPIC = "system/power-mode/set";
export const SYSTEM_FACTORY_RESET_TOPIC = "system/factory-reset";
export const SYSTEM_NETWORK_RESET_TOPIC = "system/network-reset";
export const SYSTEM_LOGS_START_COLLECTION_TOPIC = "system/logs/start-collection";
export const SYSTEM_LOGS_STOP_COLLECTION_TOPIC = "system/logs/stop-collection";
export const DEVICE_CAPTURE_IMAGE = "output/image";
export const CONTENT_SEARCH_TOPIC = "content/search";
export const CONTENT_RECOMMENDATIONS_TOPIC = "content/recommendations";
export const CONTENT_OPEN_TOPIC = "content/open";

export const DEVICE_TELEMETRY_START_TOPIC = "device-telemetry/start";
export const DEVICE_TELEMETRY_STOP_TOPIC = "device-telemetry/stop";
export const DEVICE_TELEMETRY_METRICS_TOPIC = "device-telemetry/metrics";

export const APP_TELEMETRY_START_TOPIC = "app-telemetry/start";
export const APP_TELEMETRY_STOP_TOPIC = "app-telemetry/stop";
export const APP_TELEMETRY_METRICS_TOPIC = "app-telemetry/metrics";

export const INPUT_KEY_PRESS_TOPIC = "input/key-press";
export const INPUT_KEY_LIST_TOPIC = "input/key/list";
export const INPUT_LONG_KEY_PRESS_TOPIC = "input/long-key-press";

export const HEALTH_CHECK_TOPIC = "health-check/get";

export const DEVICE_INFO_TOPIC = "device/info";
export const DAB_VERSION_TOPIC = "version";

export const DAB_MESSAGES = "messages";
export const DISCOVERY = "discovery";

export const VOICE_LIST_TOPIC = "voice/list";
export const VOICE_SET_TOPIC = "voice/set";
export const SEND_TEXT_TO_VOICE_SYSTEM_TOPIC = "voice/send-text";
export const SEND_AUDIO_TO_VOICE_SYSTEM_TOPIC = "voice/send-audio";


// Bridge specific topics
export const BRIDGE_ADD_DEVICE = "add-device";
export const BRIDGE_REMOVE_DEVICE = "remove-device";
export const BRIDGE_LIST_DEVICES = "list-devices";
export const BRIDGE_VERSION = "version";
