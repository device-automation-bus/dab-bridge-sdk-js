const deviceTelemetryStart = {
  type: "object",
  properties: {
    frequency: { type: "number" },
  },
  required: ["frequency"],
};

module.exports = deviceTelemetryStart;
