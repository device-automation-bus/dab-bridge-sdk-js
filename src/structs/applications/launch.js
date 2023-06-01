const applicationsLaunch = {
	type: 'object',
	properties: {
	appId : { type: "string"},
	parameters : { type: "string"},
	},
	required: [
		"appId",
	],
};

module.exports = applicationsLaunch;
