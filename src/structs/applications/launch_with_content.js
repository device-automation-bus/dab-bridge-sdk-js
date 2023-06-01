const applicationsLaunchWithContent = {
	type: 'object',
	properties: {
	appId : { type: "string"},
	},
	required: [
		"appId",
	],
};

module.exports = applicationsLaunchWithContent;
