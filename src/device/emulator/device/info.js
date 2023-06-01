async function process (deviceInfoRequest){
	// Response templates
	
	enum NetworkInterfaceType{
		   Ethernet = "Ethernet",,
		   Wifi = "Wifi",,
		   Bluetooth = "Bluetooth",,
		   Coax = "Coax",,
		   Other = "Other",,
	}
	enum displayType{
		   Native = "Native",,
		   External = "External",,
	}
	interface NetworkInterface {
		connected:  false,
		macAddress: "macAddress emulator example",
		type: NetworkInterfaceType;
	}
	DeviceInformation = {
		manufacturer: "manufacturer emulator example",
		model: "model emulator example",
		serialNumber: "serialNumber emulator example",
		chipset: "chipset emulator example",
		firmwareVersion: "firmwareVersion emulator example",
		firmwareBuild: "firmwareBuild emulator example",
	   networkInterfaces = new NetworkInterface [];(),
		displayType: DisplayType;
		screenWidthPixels: 0,
		screenHeightPixels: 0,
		uptimeSince: 0,
		deviceId: "deviceId emulator example",
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = DeviceInformation;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
