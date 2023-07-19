import {DabDeviceInterface} from "../interface/dab_device_interface.js";

/*
 * This is a sample Partner DAB Device Bridge Implementation that shows
 * how to extend DabDeviceInterface and implement the abstract methods.
 *
 * The Bridge is responsible for constructing the PartnerDabDevice object and providing the dabDeviceId and deviceIp.
 */
export class PartnerDabDevice extends DabDeviceInterface {

    /**
     *
     * @param deviceIp IP Address of the DUT that this implementation must translate DAB requests for.
     *                 You can assume that this IP address is reachable, but not that the device itself is in a healthy state.
     * @param dabDeviceId DAB Device ID that was generated for this specific object instance.
     *                    Used internally for topic subscription and routing.
     */
    constructor(dabDeviceId, deviceIp) {
        super(dabDeviceId);
        this.deviceIp = deviceIp; // Use for instantiating any websockets, connections, and other properties needed.
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

    launchWithContent = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    getAppState = async (data) => {
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

    sendVoiceAudio = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    voiceList = async () => {
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

    listSystemSettings = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    getSystemSettings = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    setSystemSettings = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    outputImage = async () => {
        return this.dabResponse(501, "Not implemented.");
    }
}