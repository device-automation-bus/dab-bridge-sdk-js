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

import  * as topics  from './dab_topics.js';

export class DabClient {
    /**
     Sample DAB client based on the DabMqttClient implementation
     */
    constructor(dab_mqtt_client) {
        /** @private @const  */
        this.client = dab_mqtt_client;
    }

    async showMessages() {
        this.messagesSub = await this.client.subscribe(
            topics.DAB_MESSAGES, async (message) => {
                console.log(`DAB message: ${JSON.stringify(message)}\n`);
            }
        );
    }

    async hideMessages() {
        if (this.messagesSub) await this.messagesSub.end();
    }

    async showDeviceTelemetry() {
        this.deviceTelemetrySub = await this.client.subscribe(
            topics.DEVICE_TELEMETRY_METRICS_TOPIC, async (message) => {
                console.log(`Device telemetry: ${JSON.stringify(message, null, 2)}\n`);
            }
        );
    }

    async hideDeviceTelemetry() {
        if (this.deviceTelemetrySub) await this.deviceTelemetrySub.end();
    }

    async showAppTelemetry(appId) {
        this.appTelemetrySub = await this.client.subscribe(
            `${topics.APP_TELEMETRY_METRICS_TOPIC}/${appId}`, async (message) => {
                console.log(`App telemetry: ${JSON.stringify(message, null, 2)}\n`);
            }
        );
    }

    async hideAppTelemetry() {
        if (this.appTelemetrySub) await this.appTelemetrySub.end();
    }

    async version() {
        return await this.client.subscribeOnce(topics.DAB_VERSION_TOPIC);
    }

    async deviceInfo() {
        return await this.client.subscribeOnce(topics.DEVICE_INFO_TOPIC);
    }

    async listApps() {
        return await this.client.request(
            topics.APPLICATIONS_LIST_TOPIC
        )
    }

    async listSettings() {
        return await this.client.request(
            topics.SYSTEM_SETTING_LIST_TOPIC
        )
    }

    async setSettings(settings) {
        return await this.client.request(
            topics.SYSTEM_SETTING_SET_TOPIC,
            settings
        )
    }

    async getSettings() {
        return await this.client.request(
            topics.SYSTEM_SETTING_GET_TOPIC
        )
    }

    async captureImage(url) {
        return await this.client.request(
            topics.DEVICE_CAPTURE_IMAGE,
            {
                outputLocation: url
            }
        )
    }

    async exitApp(appId, force=false) {
        return await this.client.request(
            topics.APPLICATIONS_EXIT_TOPIC,
            {
                appId: appId,
                force: force
            }
        )
    }

    async launchApp(appId, parameters) {
        return await this.client.request(
            topics.APPLICATIONS_LAUNCH_TOPIC,
            {
                appId: appId,
                parameters: parameters
            }
        )
    }

    async pressKey(keyCode){
        return await this.client.request(
            topics.INPUT_KEY_PRESS_TOPIC,
            {
                keyCode: keyCode
            }
        )
    }

    async pressKeyLong(keyCode, durationMs){
        return await this.client.request(
            topics.INPUT_LONG_KEY_PRESS_TOPIC,
            {
                keyCode: keyCode,
                durationMs: durationMs
            }
        )
    }

    async startDeviceTelemetry(duration){
        return await this.client.request(
            topics.DEVICE_TELEMETRY_START_TOPIC,
            {
                duration: duration
            }
        )
    }

    async stopDeviceTelemetry(){
        return await this.client.request(
            topics.DEVICE_TELEMETRY_STOP_TOPIC
        )
    }

    async startAppTelemetry(appId, duration){
        return await this.client.request(
            topics.APP_TELEMETRY_START_TOPIC,
            {
                appId: appId,
                duration: duration
            }
        )
    }

    async stopAppTelemetry(appId){
        return await this.client.request(
            topics.APP_TELEMETRY_STOP_TOPIC,
            {
                appId: appId
            }
        )
    }

    async restart(){
        return await this.client.request(
            topics.SYSTEM_RESTART_TOPIC
        )
    }

    async installApp(appId, url, format, timeout) {
        return await this.client.request(
            topics.APPLICATIONS_INSTALL_TOPIC,
            {
                appId: appId,
                url: url,
                format: format,
                timeout: timeout
            }
        )
    }

    async uninstallApp(appId) {
        return await this.client.request(
            topics.APPLICATIONS_UNINSTALL_TOPIC,
            {
                appId: appId
            }
        )
    }

    async clearAppData(appId) {
        return await this.client.request(
            topics.APPLICATIONS_CLEAR_DATA_TOPIC,
            {
                appId: appId
            }
        )
    }

    async installAppFromStore(appId, appStoreId) {
        return await this.client.request(
            topics.APPLICATIONS_INSTALL_FROM_APP_STORE_TOPIC,
            {
                appId: appId,
                appStoreId: appStoreId
            }
        )
    }

    async getPowerMode(){
        return await this.client.request(
            topics.SYSTEM_POWER_MODE_GET_TOPIC
        )
    }

    async setPowerMode(powerMode){
        return await this.client.request(
            topics.SYSTEM_POWER_MODE_SET_TOPIC,
            {
                powerMode: powerMode
            }
        )
    }

    async factoryReset(){
        return await this.client.request(
            topics.SYSTEM_FACTORY_RESET_TOPIC
        )
    }

    async networkReset(){
        return await this.client.request(
            topics.SYSTEM_NETWORK_RESET_TOPIC
        )
    }

    async startSystemLogCollection(){
        return await this.client.request(
            topics.SYSTEM_LOGS_START_COLLECTION_TOPIC
        )
    }

    async stopSystemLogCollection(){
        return await this.client.request(
            topics.SYSTEM_LOGS_STOP_COLLECTION_TOPIC
        )
    }

    async searchContent(searchText){
        return await this.client.request(
            topics.CONTENT_SEARCH_TOPIC,
            {
                searchText: searchText
            }
        )
    }

    async listContentRecommendations(){
        return await this.client.request(
            topics.CONTENT_RECOMMENDATIONS_TOPIC
        )
    }

    async openContent(entryId){
        return await this.client.request(
            topics.CONTENT_OPEN_TOPIC,
            {
                entryId: entryId
            }
        )
    }

    async sendVoiceText(voiceString) {
        return await this.client.request(
            topics.SEND_TEXT_TO_VOICE_SYSTEM_TOPIC,
            {
                requestText: voiceString,
                voiceSystem: "Alexa"
            }
        )
    }

    async healthCheck(){
        return await this.client.request(
            topics.HEALTH_CHECK_TOPIC
        )
    }

    async discovery(){
        return await this.client.discovery(
            topics.DISCOVERY
        )
    }
}
