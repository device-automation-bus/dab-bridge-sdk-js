import {DabDeviceInterface} from "../interface/dab_device_interface.js";

export class SampleDabDevice extends DabDeviceInterface {
    constructor(deviceIP) {
        super();
        this.deviceIP = deviceIP;
    }
}