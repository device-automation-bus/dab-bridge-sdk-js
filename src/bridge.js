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

import { MqttClient } from './lib/mqtt_client/index.js';
import  * as topics  from './interface/dab_topics.js';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import {getLogger} from "./lib/util.js";
import {PartnerDabDevice} from "./partner/partner_dab_device.js";
import config from 'config';
const logger = getLogger();

/**
 * The DabBridge class is responsible for managing multiple instances of the partner DAB Bridge implementations.
 *
 * It supports key bridge-specific operations like add-device, remove-device, and list-device, that are used
 * by automation for device onboarding and management.
 **
 * It shields details of having multiple DAB Devices being translated in a single bridge instance
 * from partner implementations.
 */
export class DabBridge {

    /**
     * DabBridge constructor is called at the beginning of the program. If a user decides give a bridgeID,
     * it will use dab/bridge/<bridge-id> as the prefix for all bridge specific operations. For example, if bridgeID was
     * "roku", one available bridge API topic would be dab/bridge/roku/add-device.
     * @param bridgeID The ID used to represent this bridge in the MQTT ecosystem.
     *                  If not provided, a random uuid will be generated instead.
     */
    constructor(bridgeID) {
        logger.info("Constructing DabBridge with BridgeID=" + bridgeID);
        if (bridgeID) {
            this.bridgeID = bridgeID;
        } else {
            this.bridgeID = uuidv4();
        }
        this.deviceMap = new Map(); // key: deviceIP, value: DabDevice object / instance
    }

    /**
     * Init to be called once at application startup, unless following stop. This is where we use the bridgeID to
     * subscribe to all the bridge-specific MQTT topics for device management.
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

        logger.info("Initialized DAB Bridge and subscribed to Bridge routes.");

        return this.client;
    }

    /**
     * Cleanly shuts down the MQTT client, clearing retained messages for version and device info
     */
    async stop() {
        // Call stop on all devices
        for (let [deviceIP, dabDeviceInstance] of this.deviceMap) {
            logger.info(`Shutting down DabDevice with IP ${deviceIP}.`);
            await dabDeviceInstance.stop();
        }


        await Promise.all(
            [
                this.notify("warn", `DAB Bridge ${this.bridgeID} has gone offline.`),
                this.client.clearRetained(`dab/bridge/${this.bridgeID}/${topics.BRIDGE_VERSION}`)
            ]
        );

        return await this.client.stop();
    }

    /**
     * Publishes generic notifications to the message topic
     */
    async notify(level, message) {
        return await this.client.publishRetained(`dab/bridge/${this.bridgeID}/${topics.DAB_MESSAGES}`,
            {
                timestamp: new Date().toISOString(),
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

    /**
     *
     * @param params.ip IP address for the device we would like to onboard into the Bridge for DAB Translation
     * @param params.skipValidation Skip compatibility checks and directly
     * @returns dabResponse -- {status, !error}
     */
    addDevice = async (params) => {
        if(!params.ip) return this.dabResponse(400, "IP address of device to add was not included.");

        logger.debug("DeviceMap:", JSON.stringify(this.deviceMap));

        if(this.deviceMap.has(params.ip)){
            return this.dabResponse(409,
                "Conflict in IP address provided. There is already an onboarded device with that IP.");
        }

        let dabDeviceInstance = null;
        try {
            if(!params.skipValidation && !PartnerDabDevice.isCompatible(params.ip))
                return this.dabResponse(500,
                    "This target device cannot be bridged by this implementation. " +
                    "isTargetDABCompatible() returned false.");

            dabDeviceInstance = new PartnerDabDevice(uuidv4(), params.ip);
        } catch (err) {
            return this.dabResponse(500, err.toString());
        }

        await dabDeviceInstance.init(config.get("mqttBroker"));
        this.deviceMap.set(params.ip, dabDeviceInstance);
        return {...this.dabResponse(), ...{deviceId: dabDeviceInstance.dabDeviceID}};
    }

    /**
     *
     * @param params The device IP Address we would like to remove from Bridge management and DAB translation
     * @returns dabResponse -- {status, !error}
     */
    removeDevice = async (params) => {
        if(!params.ip) return this.dabResponse(400, "IP address of device to remove was not included.");

        logger.debug(JSON.stringify(this.deviceMap));

        if(!this.deviceMap.has(params.ip)){
            return this.dabResponse(412,
                "Precondition failed -- IP address provided was not found in deviceMap for this bridge.");
        }

        this.deviceMap.get(params.ip).stop(); // Stop the device MQTT client and clear any messages
        this.deviceMap.delete(params.ip); // Delete entry from deviceMap
        return this.dabResponse();
    }

    /**
     *
     * @returns List of entries, each containing the DAB Device ID and its associated IP address for an onboarded device.
     */
    listDevices = async (params) => {
        let deviceArray = [];
        this.deviceMap.forEach((value, key, map) => {
            deviceArray.push({ip: key, deviceId: value.deviceId});
        })
        return {...this.dabResponse(), ...{deviceList: deviceArray}};
    }

    version(){
        const packageVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version;
        return { ...this.dabResponse(), ...{version: packageVersion} };
    }

}
