// StartDeviceTelemetryRequest = {
// frequency: 0,
// }
async function process(StartDeviceTelemetryRequest) {
  // Implement the enablement of device level telemetry collection for your device
  // at the requested update frequency and change the status code of the response accordingly.

  // Enhance the sample response provided below with additional parameters as specified in
  // the StartDeviceTelemetryResponse structure within the DAB spec.
  return [{
    status: 501,
    error: "The requested functionality is not implemented.",
  }];
}

module.exports = process;
