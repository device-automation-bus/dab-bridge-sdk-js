import {DabDeviceInterface} from "../interface/dab_device_interface.js";

export class SampleDabDevice extends DabDeviceInterface {
    constructor(deviceIP) {
        super();
        this.deviceIP = deviceIP;
    }

    deviceInfo = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    listApps = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    launchApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    exitApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    restartDevice = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    keyPress = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    sendVoiceText = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    startDeviceTelemetry = async (data) => {
        // DabDeviceInterface handles firing and reporting device telemetry on its own using startDeviceTelemetryImpl
        // As a partner, you just need to implement the callback function and return data
        return await this.startDeviceTelemetryImpl(data, async () => {
            return this.dabResponse(501, "Not implemented.");
        })
    };

    stopDeviceTelemetry = async () => {
        return await this.stopDeviceTelemetryImpl();
    };

    healthCheck = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    discovery = async () => {
        return this.dabResponse(501, "Not implemented.");
    }
}