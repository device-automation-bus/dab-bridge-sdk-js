// DiscoverDevicesRequest{
//}
async function process(DiscoverDevicesRequest) {
  // Implement an operation to discover all DAB capable devices in the network.

  // For this request the expectation is that for each device that is DAB capable
  // a response in the format of DiscoverDevicesResponse is provided.
  return {
    status: 501,
    error: "The requested functionality is not implemented.",
  };
}

module.exports = process;
