async function process (discoveryRequest){
	// Response templates
	
	DiscoveryResponse = {
		ip: "ip emulator example",
		deviceId: "deviceId emulator example",
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = DiscoveryResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
