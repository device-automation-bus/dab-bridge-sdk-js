const appTelemetryStart = {
  type: "object",
  properties: {
    appId: { type: "string" },
    frequency: { type: "number" },
  },
  required: ["appId", "frequency"],
};

module.exports = appTelemetryStart;
