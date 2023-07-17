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

export const APPLICATIONS_LIST_TOPIC = "applications/list";
export const APPLICATIONS_LAUNCH_TOPIC = "applications/launch";
export const APPLICATIONS_LAUNCH_WITH_CONTENT_TOPIC = "applications/launch-with-content";
export const APPLICATIONS_GET_STATE_TOPIC = "applications/get-state";
export const APPLICATIONS_EXIT_TOPIC = "applications/exit";

export const SYSTEM_RESTART_TOPIC = "system/restart";
export const SYSTEM_LANGUAGE_LIST_TOPIC = "system/language/list";
export const SYSTEM_LANGUAGE_GET_TOPIC = "system/language/get";
export const SYSTEM_LANGUAGE_SET_TOPIC = "system/language/set";
export const SYSTEM_SETTING_LIST_TOPIC = "system/settings/list";
export const SYSTEM_SETTING_SET = "system/settings/set";
export const DEVICE_CAPTURE_IMAGE = "output/image";

export const DEVICE_TELEMETRY_START_TOPIC = "device-telemetry/start";
export const DEVICE_TELEMETRY_STOP_TOPIC = "device-telemetry/stop";

export const APP_TELEMETRY_START_TOPIC = "app-telemetry/start";
export const APP_TELEMETRY_STOP_TOPIC = "app-telemetry/stop";

export const TELEMETRY_METRICS_TOPIC = "device-telemetry/metrics";

export const INPUT_KEY_PRESS_TOPIC = "input/key-press";
export const INPUT_LONG_KEY_PRESS_TOPIC = "input/long-key-press";

export const HEALTH_CHECK_TOPIC = "health-check/get";

export const DEVICE_INFO_TOPIC = "device/info";
export const DAB_VERSION_TOPIC = "version";

export const DAB_MESSAGES = "messages";
export const DISCOVERY = "discovery";

export const SEND_TEXT_TO_VOICE_SYSTEM_TOPIC = "voice/send-text";
export const SEND_AUDIO_TO_VOICE_SYSTEM_TOPIC = "voice/send-audio";


// Bridge specific topics
export const BRIDGE_ADD_DEVICE = "add-device";
export const BRIDGE_REMOVE_DEVICE = "add-device";
export const BRIDGE_LIST_DEVICES = "list-devices";
export const BRIDGE_VERSION = "version";