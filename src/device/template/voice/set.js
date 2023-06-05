// SetVoiceSystemRequest = {
// voiceSystem: VoiceSystem;
// }
async function process(SetVoiceSystemRequest) {
  // Implement an operation to switch the active voice assistant system on the device.

  // Enhance the sample response provided below with additional parameters as specified in
  // the SetVoiceSystemResponse structure within the DAB spec.
  return [{
    status: 501,
    error: "The requested functionality is not implemented.",
  }];
}

module.exports = process;
