async function process (getSystemSettingsRequest){
	// Response templates
	
	GetSystemSettingsResponse = {
		language: "language emulator example",
		outputResolution: OutputResolution;
		memc:  false,
		cec:  false,
		lowLatencyMode:  false,
		matchContentFrameRate: MatchContentFrameRate;
		hdrOutputMode: HdrOutputMode;
		pictureMode: PictureMode;
		audioOutputMode: AudioOutputMode;
		audioOutputSource: AudioOutputSource;
		videoInputSource: VideoInputSource;
		audioVolume: 0,
		mute:  false,
		textToSpeech:  false,
	}
	let responseError = {
		status : 501,
		error : "sample error message",
	};

	//###### Device-specific: Change the code below for your device ######
	
	
	
	
	// response can be in format responseOk or responseError. Modify these structures accordingly.
	// response = responseError;
	let response = GetSystemSettingsResponse;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
