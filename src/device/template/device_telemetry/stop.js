// StopDeviceTelemetryRequest = {
// }
async function process(deviceId, StopDeviceTelemetryRequest) {
  // Implement the disablement of device level telemetry collection for your device
  // and change the status code of the response accordingly.

  // Enhance the sample response provided below with additional parameters as specified in
  // the StopDeviceTelemetryResponse structure within the DAB spec.
  return {
    status: 501,
    error: "The requested functionality is not implemented.",
  };
}

module.exports = process;
