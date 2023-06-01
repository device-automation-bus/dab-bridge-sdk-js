const voiceSendText = {
	type: 'object',
	properties: {
	requestText : { type: "string"},
	voiceSystem : { type: "string"},
	},
	required: [
		"requestText",
		"voiceSystem",
	],
};

module.exports = voiceSendText;
