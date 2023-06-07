// DiscoverDevicesRequest{
//}
async function process(DiscoverDevicesRequest) {
  // Implement an operation to discover all DAB capable devices in the network.

  // For this request the expectation is that for each discovered device that
  // is DAB capable add a response json in the retrurn array in the format of
  // DiscoverDevicesResponse.
  return [{
    status: 501,
    error: "The requested functionality is not implemented.",
  }];
}

module.exports = process;
