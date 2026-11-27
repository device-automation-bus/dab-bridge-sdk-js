import { DabDeviceInterface } from "../interface/dab_device_interface.js";
import { getLogger } from "../lib/util.js";
const logger = getLogger();

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
    static async isCompatible(deviceIP){
        // Do checks and return true if target deviceIP can be used for your DAB implementation.
        // You may also throw errors, the bridge will catch these and use them as reasoning for why the add-device failed.

        //Any resources, connections, or properties created in the process of confirming that your bridge implementation
        // is fully compatible with the target deviceIP must be cleaned up.
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
        this.deviceIP = deviceIP;
        // Use for storing any properties or object building.
        // Note that async / await calls cannot be made here, but can be in the init() method below,
        // which will be called immediately after construction.
    }


    /**
     * This async initialization function is called immediately after the construction of this class,
     * but before any DAB functions below are invoked.
     *
     * @param uri MQTT Broker URI that is used by the superclass init.
     * @returns super.init(uri); --> already predefined
     */
    init = async (uri) => {
        logger.debug("Initializing in partner implementation.");
        // Use in-built logger to send .info() .debug() or .error() messages.

        // Instantiate any websockets, connections, and other persistent properties needed to handle DAB requests.

        return super.init(uri);
    }

    /**
     * type ListSupportedOperationRequest = DabRequest
     * @returns interface ListSupportedOperationResponse extends DabResponse {
     *    operations: string [];
     * }
     * The default lists every DAB operation except operations/list itself. Remove the ones
     * your device does not support.
     */
    listSupportedOperations = async () => {
        const response = await super.listSupportedOperations();
        // const unsupported = ["voice/list", "voice/set", "voice/send-audio", "voice/send-text"];
        // response.operations = response.operations.filter((operation) => !unsupported.includes(operation));
        return response;
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
     * Answer 200 only after the application has launched (spec section 3.5).
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
     *    background?: boolean;
     * }
     * @returns interface ExitApplicationResponse extends DabResponse {
     *    state: string;
     * }
     * background true moves the application to BACKGROUND; false or omitted stops it.
     * Answer 200 only after the application state has changed (spec section 3.5).
     */
    exitApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface InstallApplicationRequest extends DabRequest {
     *    appId: string;
     *    url: string;
     *    format?: string;
     *    timeout?: number;
     * }
     * @returns type InstallApplicationResponse = DabResponse
     * timeout is in seconds. If the installation takes longer, stop it and answer 408.
     */
    installApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface UninstallApplicationRequest extends DabRequest {
     *    appId: string;
     * }
     * @returns type UninstallApplicationResponse = DabResponse
     * Answer 403 if the uninstallation fails.
     */
    uninstallApp = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface ClearApplicationDataRequest extends DabRequest {
     *    appId: string;
     * }
     * @returns type ClearApplicationDataResponse = DabResponse
     */
    clearAppData = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface InstallApplicationFromAppStoreRequest extends DabRequest {
     *    appId: string;
     *    appStoreId?: string;
     * }
     * @returns type InstallApplicationFromAppStoreResponse = DabResponse
     * Answer 401 if the app store requires the user to log in.
     */
    installAppFromStore = async (data) => {
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
     * type GetPowerModeRequest = DabRequest
     * @returns interface GetPowerModeResponse extends DabResponse {
     *    powerMode: "Active" | "Standby" | "Deep Sleep";
     * }
     */
    getPowerMode = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface SetPowerModeRequest extends DabRequest {
     *    powerMode: "Active" | "Standby" | "Deep Sleep";
     * }
     * @returns interface SetPowerModeResponse extends DabResponse {
     *    powerMode: "Active" | "Standby" | "Deep Sleep";
     * }
     * Answer only after the device is in the requested mode, and include the current
     * powerMode. The wire value is "Deep Sleep", with a space. DAB must stay reachable
     * in every power mode.
     */
    setPowerMode = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type FactoryResetRequest = DabRequest
     * @returns type FactoryResetResponse = DabResponse
     */
    factoryReset = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type NetworkResetRequest = DabRequest
     * @returns type NetworkResetResponse = DabResponse
     */
    networkReset = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type StartSystemLogCollectionRequest = DabRequest
     * @returns type StartSystemLogCollectionResponse = DabResponse
     */
    startSystemLogCollection = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type StopSystemLogCollectionRequest = DabRequest
     * @returns interface StopSystemLogCollectionResponse extends DabResponse {
     *    logArchive?: string;
     *    remainingChunks?: number;
     * }
     * To send the archive in chunks, return an array or an async iterable of responses. Each one
     * is published in order as its own response to the request. Count remainingChunks down to 0
     * and send the chunks at most 2 seconds apart.
     */
    stopSystemLogCollection = async () => {
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
            // Return a TelemetryMessage, e.g. {timestamp: Date.now(), metric: "cpu", value: 12.5}
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
        return await this.startAppTelemetryImpl(data, async (appId) => {
            // DabDeviceInterface handles firing and reporting app telemetry on its own using startAppTelemetryImpl
            // As a partner, you just need to implement this callback function and return data
            // The appId variable refers to which application this callback is for.

            logger.debug("App Telemetry callback received by partner for appId:", appId);
            // This function will be invoked in regular intervals as per the request duration.
            // Return a TelemetryMessage, e.g. {timestamp: Date.now(), metric: "memory", value: 1024}
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
        return this.dabResponse(200, {deviceId: this.dabDeviceID, ip: this.deviceIP});
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
     *    brightness: {
     *       min: int;
     *       max: int;
     *    };
     *    contrast: {
     *       min: int;
     *       max: int;
     *    };
     *    timeZone: TimeZone [];
     *    screenSaver: boolean;
     *    screenSaverMinTimeout: int; // minimum screensaver timeout in seconds, at most 60
     *    personalizedAds: boolean;
     *    highContrastText: boolean;
     *    identifierForAdvertising: boolean;
     *    textToSpeech: boolean;
     * }
     *
     * Omit the settings the device does not support instead of reporting false or 0.
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
     *    brightness: int;
     *    contrast: int;
     *    timeZone: TimeZone;
     *    screenSaver: boolean;
     *    screenSaverTimeout: int;
     *    personalizedAds: boolean;
     *    highContrastText: boolean;
     *    identifierForAdvertising: string | null;
     *    textToSpeech: boolean;
     * }
     *
     * interface GetCurrentSystemSettingsResponse extends DabResponse, SystemSettings {}
     *
     * Omit the settings the device does not support instead of reporting false or 0.
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

    /**
     * @param data interface SearchContentRequest extends DabRequest {
     *    searchText: string;
     * }
     * @returns interface SearchContentResponse extends DabResponse {
     *    entries: ContentEntry [];
     * }
     */
    searchContent = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * type ListContentRecommendationsRequest = DabRequest
     * @returns interface ListContentRecommendationsResponse extends DabResponse {
     *    entries: ContentEntry [];
     * }
     */
    listContentRecommendations = async () => {
        return this.dabResponse(501, "Not implemented.");
    }

    /**
     * @param data interface OpenContentRequest extends DabRequest {
     *    entryId: string;
     * }
     * @returns type OpenContentResponse = DabResponse
     * Answer 200 only after the content is open, and 404 for an unknown entryId.
     */
    openContent = async (data) => {
        return this.dabResponse(501, "Not implemented.");
    }
}
