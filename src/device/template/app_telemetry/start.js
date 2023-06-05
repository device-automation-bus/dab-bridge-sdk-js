// StartApplicationTelemetryRequest = {
// appId: "appId emulator example",
// frequency: 0,
// }
async function process(StartApplicationTelemetryRequest) {
  // Implement the enablement of application level telemetry collection for your device
  // for the app identified by appId and change the status code of the response accordingly.

  // Enhance the sample response provided below with additional parameters as specified in
  // the StartApplicationTelemetryResponse structure within the DAB spec.
  return [{
    status: 501,
    error: "The requested functionality is not implemented.",
  }];
}

module.exports = process;
