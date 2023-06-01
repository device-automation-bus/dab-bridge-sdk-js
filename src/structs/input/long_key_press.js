const inputLongKeyPress = {
	type: 'object',
	properties: {
	keyCode : { type: "string"},
	durationMs : { type: "int"},
	},
	required: [
		"keyCode",
		"durationMs",
	],
};

module.exports = inputLongKeyPress;
