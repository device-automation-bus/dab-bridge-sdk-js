const outputImage = {
	type: 'object',
	properties: {
	outputLocation : { type: "url"},
	},
	required: [
		"outputLocation",
	],
};

module.exports = outputImage;
