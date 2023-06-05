// GetApplicationStateRequest = {
// appId: "appId emulator example",
// }
async function process(GetApplicationStateRequest) {
  // Implement the get application state (foreground, background or not running) operation
  // for your device for the app identified by appId and change the status code of the response accordingly.

  // Enhance the sample response provided below with additional parameters as specified in
  // the GetApplicationStateResponse structure within the DAB spec.
  return [{
    status: 501,
    error: "The requested functionality is not implemented.",
  }];
}

module.exports = process;
