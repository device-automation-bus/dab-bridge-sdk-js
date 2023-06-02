const voiceSet = {
  type: "object",
  properties: {
    voiceSystem: { type: "VoiceSystem" },
  },
  required: ["voiceSystem"],
};

module.exports = voiceSet;
