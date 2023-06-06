// LaunchApplicationWithContentRequest = {
// appId: "appId emulator example",
// contentId: "contentId emulator example",
// }
async function process(deviceIp, LaunchApplicationWithContentRequest) {
  // Implement the operation to launch the application identified by appId and pass a
  // contentId parameter to the app. Also change the status code of the response accordingly.

  // Enhance the sample response provided below with additional parameters as specified in
  // the LaunchApplicationWithContentResponse structure within the DAB spec.
  return {
    status: 501,
    error: "The requested functionality is not implemented.",
  };
}

module.exports = process;
