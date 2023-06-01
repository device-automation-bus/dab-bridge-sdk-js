async function process (listSystemSettingsRequest){
	// Response templates
	
	interface OutputResolution {
		width: 0,
		height: 0,
		frequency: 0,
	}
	enum MatchContentFrameRate{
		    EnabledAlways = "EnabledAlways",,
		    EnabledSeamlessOnly = "EnabledSeamlessOnly",,
		    Disabled = "Disabled",,
	}
	enum HdrOutputMode{
		    AlwaysHdr = "AlwaysHdr",,
		    HdrOnPlayback = "HdrOnPlayback",,
		    DisableHdr = "DisableHdr",,
	}
	enum PictureMode{
		    Standard = "Standard",,
		    Dynamic = "Dynamic",,
		    Movie = "Movie",,
		    Sports = "Sports",,
		    FilmMaker = "FilmMaker",,
		    Game = "Game",,
		    Auto = "Auto",,
	}
	enum AudioOutputMode{
		    Stereo = "Stereo",,
		    MultichannelPcm = "MultichannelPcm",,
		    PassThrough = "PassThrough",,
		    Auto = "Auto",,
	}
	enum AudioOutputSource{
		    NativeSpeaker = "NativeSpeaker",,
		    Arc = "Arc",,
		    EArc = "EArc",,
		    Optical = "Optical",,
		    Aux = "Aux",,
		    Bluetooth = "Bluetooth",,
		    Auto = "Auto",,
		    HDMI = "HDMI",,
	}
	enum VideoInputSource{
		    Tuner = "Tuner",,
		    HDMI1 = "HDMI1",,
		    HDMI2 = "HDMI2",,
		    HDMI3 = "HDMI3",,
		    HDMI4 = "HDMI4",,
		    Composite = "Composite",,
		    Component = "Component",,
		    Home = "Home",,
		    Cast = "Cast",,
	}
	ListSystemSettings = {
	language: ["language1","language2"],
	   outputResolution = new OutputResolution [];(),
		memc:  false,
		cec:  false,
		lowLatencyMode:  false,
	   matchContentFrameRate = new MatchContentFrameRate [];(),
	   hdrOutputMode = new HdrOutputMode [];(),
	   pictureMode = new PictureMode [];(),
	   audioOutputMode = new AudioOutputMode [];(),
	   audioOutputSource = new AudioOutputSource [];(),
	   videoInputSource = new VideoInputSource [];(),
		audioVolume: {
			min: 0,
			max: 0,
		   },
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
	let response = ListSystemSettings;
	
	
	
	
	//###### End of device-specific routines ######
	return response;
}

module.exports = process;
