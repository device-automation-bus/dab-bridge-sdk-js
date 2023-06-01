async function process (requestParams){
	// Response templates
	
	SetSystemSettingsResponse = {
		language: String,
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = SetSystemSettingsResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
