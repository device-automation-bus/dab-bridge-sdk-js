const voiceSendAudio = {
	type: 'object',
	properties: {
	fileLocation : { type: "url"},
	voiceSystem : { type: "string"},
	},
	required: [
		"fileLocation",
	],
};

module.exports = voiceSendAudio;
