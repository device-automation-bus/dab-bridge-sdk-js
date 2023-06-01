async function process (startDeviceTelemetryRequest){
	// Response templates
	
	StartDeviceTelemetryResponse = {
		frequency: 0,
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = StartDeviceTelemetryResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
