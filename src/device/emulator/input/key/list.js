async function process (listKeyRequest){
	// Response templates
	
	KeyList = {
	keyCodes: ["sample_string1","sample_string2"],
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = KeyList;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
