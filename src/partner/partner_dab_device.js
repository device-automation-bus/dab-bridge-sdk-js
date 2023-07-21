import {DabDeviceInterface} from "../interface/dab_device_interface.js";

/*
 * This is a sample Partner DAB Device Bridge Implementation that shows
 * how to extend DabDeviceInterface and implement the abstract methods.
 *
 * The Bridge is responsible for constructing the PartnerDabDevice object and providing the dabDeviceId and deviceIp.
 */
export class PartnerDabDevice extends DabDeviceInterface {


    /**
     * Given a deviceIP, this function MUST return true or false depending on if this implementation
     * can handle DAB translation for this device IP. For example, you may check available native automation hooks,
     * firmware, or other native configuration requirements for this DAB Bridge implementation to work with the target.
     *
     * This function is static, and will be called during add-device, before the construction of the class as an instance.
     *
     * @param deviceIP The target IP address of the device the user wishes to start DAB bridging for.
     */
    static isCompatible(deviceIP){
        // Do checks and return true if target deviceIP can be used for your DAB implementation.
        // You may also throw errors, the bridge will catch these and use them as reasoning for why the add-device failed.

        return false;
    }

    /**
     * This constructor is called by the Bridge after isTargetDABCompatible() return true, but before any other DAB
     * operation functions are invoked.
     *
     * You may use this opportunity to instantiate long-living connections, shared objects, or other properties needed
     * to successfully execute the below DAB functions.
     *
     * @param deviceIP IP Address of the DUT that this implementation must translate DAB requests for.
     *                 You can assume that this IP address is reachable.
     * @param dabDeviceId DAB Device ID that was generated for this specific object instance.
     *                    Used internally for topic subscription and routing.
     */
    constructor(dabDeviceId, deviceIP) {
        super(dabDeviceId);
        this.deviceIP = deviceIP; // Use for instantiating any websockets, connections, and other properties needed.
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
     * @param data interface SendVoiceAsTextRequest extends DabRequest {
     *    requestText: string;
     *    voiceSystem: string;
     * }
     * @returns type SendVoiceAsTextResponse = DabResponse
     */
    sendVoiceText = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface SendVoiceAsAudioRequest extends DabRequest {
     *    fileLocation: url;
     *    voiceSystem?: string;
     * }
     * @returns type SendVoiceAsAudioResponse = DabResponse
     */
    sendVoiceAudio = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type ListSupportedVoiceSystemsRequest = DabRequest
     * interface VoiceSystem {
     *    name: string;
     *    enabled: boolean;
     * }
     * @returns interface ListSupportedVoiceSystemsResponse extends DabResponse {
     *    voiceSystems: VoiceSystem [];
     * }
     */
    voiceList = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     *
     * @param data interface SetVoiceSystemRequest extends DabRequest {
     *    voiceSystem: VoiceSystem;
     * }
     * @returns interface SetVoiceSystemResponse extends DabResponse {
     *    voiceSystem: VoiceSystem;
     * }
     */
    voiceSet = async (data) => {
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
        return await this.startDeviceTelemetryImpl(data, async () => {
            // DabDeviceInterface handles firing and reporting device telemetry on its own using startDeviceTelemetryImpl
            // As a partner, you just need to implement this callback function and return data
            // This function will be invoked in regular intervals as per the request duration.
            return this.dabResponse(501, "Not implemented.");
        })
    };

    /**
     * Already implemented on partner behalf, no action needed.
     *
     * interface StopDeviceTelemetryRequest extends DabRequest
     * @returns type StopDeviceTelemetryResponse = DabResponse
     */
    stopDeviceTelemetry = async () => {
        return await this.stopDeviceTelemetryImpl();
    };

    /**
     *
     * @param data interface StartApplicationTelemetryRequest extends DabRequest {
     *    appId: string;
     *    duration: number;
     * }
     * @returns interface StartApplicationTelemetryResponse extends DabResponse {
     *    duration: number;
     * }
     */
    startAppTelemetry = async (data) => {
        return await this.startAppTelemetryImpl(data, async () => {
            // DabDeviceInterface handles firing and reporting app telemetry on its own using startAppTelemetryImpl
            // As a partner, you just need to implement this callback function and return data
            // This function will be invoked in regular intervals as per the request duration.
            return this.dabResponse(501, "Not implemented.");
        })
    };

    /**
     * Already implemented on partner behalf, no action needed.
     *
     * @param data interface StopApplicationTelemetryRequest extends DabRequest {
     *    appId: string;
     * }
     * @returns type StopApplicationTelemetryResponse = DabResponse
     */
    stopAppTelemetry = async (data) => {
        return await this.stopAppTelemetryImpl(data);
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
        return this.dabResponse(200, {deviceId: this.dabDeviceID, deviceIP: this.deviceIP});
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
     * @param data interface SetSystemSettingsRequest extends DabRequest {
     *    [system_setting_key: keyof SystemSettings]: [value: any];
     * }
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