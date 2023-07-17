/**
 Copyright 2019 Amazon.com, Inc. or its affiliates.
 Copyright 2019 Netflix Inc.
 Copyright 2019 Google LLC
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

import { MqttClient } from './lib/mqtt_client/index.js';
import  * as topics  from './interface/dab_topics.js';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import {getLogger} from "./lib/util.js";
const logger = getLogger();

export class DabBridge {
    /**
     * Constructor for DabDeviceInterface
     * Don't construct this interface directly.
     */
    constructor(bridgeID) {
        logger.debug("Constructing DabBridge with BridgeID=" + bridgeID);
        if (bridgeID) {
            this.bridgeID = bridgeID;
        } else {
            this.bridgeID = uuidv4();
        }
    }

    /**
     * Init to be called once at application startup, unless following stop
     */
    async init(uri) {
        this.client = new MqttClient();

        //Pre-Init Handler Registration
        await Promise.all(
            [
                this.client.handle(`dab/bridge/${this.bridgeID}/${topics.BRIDGE_ADD_DEVICE}`, this.addDevice),
                this.client.handle(`dab/bridge/${this.bridgeID}/${topics.BRIDGE_REMOVE_DEVICE}`, this.removeDevice),
                this.client.handle(`dab/bridge/${this.bridgeID}/${topics.BRIDGE_LIST_DEVICES}`, this.listDevices),
            ]
        );

        //Start MQTT Client
        await this.client.init(uri);

        //Post-Init publishing of retained messages and inital notifications
        await Promise.all(
            [
                this.client.publishRetained(`dab/bridge/${this.bridgeID}/${topics.BRIDGE_VERSION}`, this.version()),
                this.notify("info", `DAB Bridge ${this.bridgeID} is online!`)
            ]
        );

        logger.debug("Initialized DAB Bridge and subscribed to Bridge routes.");

        return this.client;
    }

    /**
     * Cleanly shuts down the MQTT client, clearing retained messages for version and device info
     */
    async stop() {
        // TODO, call stop on all devices
        await Promise.all(
            [
                this.notify("warn", `DAB Bridge ${this.bridgeID} is online!`),
                this.client.clearRetained(topics.DAB_VERSION_TOPIC)
            ]
        );

        return await this.client.stop();
    }

    /**
     * Publishes notifications to the message topic
     */
    async notify(level, message) {
        return await this.client.publish(topics.DAB_MESSAGES,
            {
                timestamp: +new Date(),
                level: level,
                message: message
            });
    }

    /**
     * @typedef {Object} DabResponse
     * @property {number} status - Response status code
     * @property {string} [error] - Error message if non 2XX response returned
     */
    dabResponse(status = 200, error) {
        const response = {status: status};
        if (Math.floor(status / 100) !== 2) {
            if (!error) throw new Error("Error message must be returned for non 2XX status results");
            response.error = error;
        }
        return response;
    }

    async addDevice(data) {
        return this.dabResponse(501, "Not implemented.");
    }

    async removeDevice(data){
        return this.dabResponse(501, "Not implemented.");
    }

    async listDevices(data) {
        logger.debug(this.bridgeID);
        logger.debug(this);
        return this.dabResponse(501, "Not implemented.");
    }

    version(data){
        const packageVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version;
        const dabVersion = packageVersion.substring(packageVersion, packageVersion.lastIndexOf(".")); // remove patch version
        return { ...this.dabResponse(), ...{version: dabVersion} };
    }

}
