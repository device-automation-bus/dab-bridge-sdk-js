async function process (requestParams){
	// Response templates
	
	interface Application {
		appId: "appId emulator example",
	}
	ListApplicationsResponse = {
	   applications = new Application [];(),
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = ListApplicationsResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
