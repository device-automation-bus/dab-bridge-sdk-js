const applicationsGetState = {
  type: "object",
  properties: {
    appId: { type: "string" },
  },
  required: ["appId"],
};

module.exports = applicationsGetState;
