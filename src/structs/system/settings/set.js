const systemSettingsSet = {
	type: 'object',
	properties: {
	[system_setting_key : { type: "keyof SystemSettings]"},
	},
	required: [
		"[system_setting_key",
		],
	};

	module.exports = systemSettingsSet;
