const applicationsLaunchWithContent = {
  type: "object",
  properties: {
    appId: { type: "string" },
    contentId: { type: "string" },
    parameters: { type: "string" },
  },
  required: ["appId", "contentId"],
};

module.exports = applicationsLaunchWithContent;
