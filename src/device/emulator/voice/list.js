async function process (voiceListRequest){
	// Response templates
	
	interface VoiceSystem {
		name: "name emulator example",
		enabled:  false,
	}
	ListVoiceResponse = {
	   voiceSystems = new VoiceSystem [];(),
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = ListVoiceResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
