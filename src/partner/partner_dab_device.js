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

    /**
     * type ListSupportedOperationRequest = DabRequest
     * @returns interface ListSupportedOperationResponse extends DabResponse {
     *    operations: string [];
     * }
     */
    listSupportedOperations = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type GetDeviceInformationRequest = DabRequest
     * @returns
     * interface GetDeviceInformationResponse extends DabResponse {
     *    manufacturer: string;
     *    model: string;
     *    serialNumber: string;
     *    chipset: string;
     *    firmwareVersion: string;
     *    firmwareBuild: string;
     *    networkInterfaces: NetworkInterface [];
     *    displayType: DisplayType;
     *    screenWidthPixels: number;
     *    screenHeightPixels: number;
     *    uptimeSince: unix_timestamp_ms;
     *    deviceId: string;
     * }
     */
    deviceInfo = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type ListApplicationsRequest = DabRequest
     * interface Application {
     *    appId: string;
     *    friendlyName?: string;
     *    version?: string;
     * }
     * @returns interface ListApplicationsResponse extends DabResponse {
     *    applications: Application [];
     * }
     * Please refer to DAB Specification for exact details about field formats.
     */
    listApps = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface LaunchApplicationRequest extends DabRequest {
     *    appId: string;
     *    parameters?: string [];
     * }
     * @returns type LaunchApplicationResponse = DabResponse
     */
    launchApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface LaunchApplicationWithContentRequest extends DabRequest {
     *    appId: string;
     *    contentId: string;
     *    parameters?: string [];
     * }
     * @returns type LaunchApplicationWithContentResponse = DabResponse
     */
    launchWithContent = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface GetApplicationStateRequest extends DabRequest {
     *    appId: string;
     * }
     * @returns interface GetApplicationStateResponse extends DabResponse {
     *    state: string;
     * }
     */
    getAppState = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface ExitApplicationRequest extends DabRequest {
     *    appId: string;
     *    force?: boolean;
     * }
     * @returns interface ExitApplicationResponse extends DabResponse {
     *    state: string;
     * }
     */
    exitApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type RestartDeviceRequest = DabRequest
     * @returns type RestartDeviceResponse = DabResponse
     */
    restartDevice = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type ListSupportedKeysRequest = DabRequest
     * @returns interface ListSupportedKeysResponse extends DabResponse {
     *    keyCodes: string [];
     * }
     */
    listSupportedKeys = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface SendKeyPressRequest extends DabRequest {
     *    keyCode: string;
     * }
     * @returns type SendKeyPressResponse = DabResponse
     */
    keyPress = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface SendLongKeyPressRequest extends DabRequest {
     *    keyCode: string;
     *    durationMs: int;
     * }
     * @returns type SendLongKeyPressResponse = DabResponse
     */
    keyPressLong = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data
     * @returns {Promise<{status: number}>}
     */
    sendVoiceText = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }


    sendVoiceAudio = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    voiceList = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface StartDeviceTelemetryRequest extends DabRequest {
     *    duration: number;
     * }
     * @returns interface StartDeviceTelemetryResponse extends DabResponse {
     *    duration: number;
     * }
     */
    startDeviceTelemetry = async (data) => {
        // DabDeviceInterface handles firing and reporting device telemetry on its own using startDeviceTelemetryImpl
        // As a partner, you just need to implement the callback function and return data
        return await this.startDeviceTelemetryImpl(data, async () => {
            return this.dabResponse(501, "Not implemented.");
        })
    };

    /**
     * interface StopDeviceTelemetryRequest extends DabRequest
     * @returns type StopDeviceTelemetryResponse = DabResponse
     */
    stopDeviceTelemetry = async () => {
        return await this.stopDeviceTelemetryImpl();
    };

    /**
     * type CheckDeviceHealthRequest = DabRequest
     * @returns interface CheckDeviceHealthResponse extends DabResponse {
     *    healthy: boolean;
     *    message?: string;
     * }
     */
    healthCheck = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * Note -- This is already implemented for you. No action is needed.
     * @returns {Promise<{status: number}>}
     */
    discovery = async () => {
        return this.dabResponse(200, {deviceId: this.dabDeviceID, deviceIp: this.deviceIp});
    }

    /**
     * type ListSupportedSystemSettingsRequest = DabRequest
     * @returns interface ListSupportedSystemSettingsResponse extends DabResponse {
     *    language: rfc_5646_language_tag [];
     *    outputResolution: OutputResolution [];
     *    memc: boolean;
     *    cec: boolean;
     *    lowLatencyMode: boolean;
     *    matchContentFrameRate: MatchContentFrameRate [];
     *    hdrOutputMode: HdrOutputMode [];
     *    pictureMode: PictureMode [];
     *    audioOutputMode: AudioOutputMode [];
     *    audioOutputSource: AudioOutputSource [];
     *    videoInputSource: VideoInputSource [];
     *    audioVolume: {
     *       min: int;
     *       max: int;
     *    },
     *    mute: boolean;
     *    textToSpeech: boolean;
     * }
     *
     * Please refer to DAB Specification for exact details about field formats.
     */
    listSystemSettings = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type GetCurrentSystemSettingsRequest = DabRequest
     * @returns interface SystemSettings {
     *    language: rfc_5646_language_tag;
     *    outputResolution: OutputResolution;
     *    memc: boolean;
     *    cec: boolean;
     *    lowLatencyMode: boolean;
     *    matchContentFrameRate: MatchContentFrameRate;
     *    hdrOutputMode: HdrOutputMode;
     *    pictureMode: PictureMode;
     *    audioOutputMode: AudioOutputMode;
     *    audioOutputSource: AudioOutputSource;
     *    videoInputSource: VideoInputSource;
     *    audioVolume: int;
     *    mute: boolean;
     *    timeZone: TimeZone;
     *    textToSpeech: boolean;
     * }
     *
     * interface GetCurrentSystemSettingsResponse extends DabResponse, SystemSettings {}
     */
    getSystemSettings = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * interface SetSystemSettingsRequest extends DabRequest {
     *    [system_setting_key: keyof SystemSettings]: [value: any];
     * }
     * @param data
     * @returns
     * interface SetSystemSettingsResponse extends DabResponse {
     *    [system_setting_key: keyof SystemSettings]: [value: any];
     * }
     */
    setSystemSettings = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * interface CaptureScreenshotRequest = DabRequest
     * @returns interface CaptureScreenshotResponse extends DabResponse {
     *    outputImage: string; // base64 encoded PNG image in a data URL
     * }
     */
    outputImage = async () => {
        return this.dabResponse(501, "Not implemented.");
    }
}