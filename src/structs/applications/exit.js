const applicationsExit = {
	type: 'object',
	properties: {
	appId : { type: "string"},
	force : { type: "boolean"},
	},
	required: [
		"appId",
	],
};

module.exports = applicationsExit;
