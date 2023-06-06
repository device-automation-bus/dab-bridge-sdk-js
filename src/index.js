const { Command } = require("commander");
const crypto = require("crypto");
const mqtt = require("mqtt");

function main() {
  console.log("DAB Bridge");

  // Parse command line arguments using Commander
  const program = new Command();
  program
    .option("-t, --target <string>", " Example: -t emulator")
    .option(
      "-i, --bridgeID <string>",
      "(Optional) The bridge-id on the network. Generates a random bridge-id string if blank. Example: -i myBridge0"
    )
    .option(
      "-b, --brokerIP <string>",
      "(Optional) The IP address of the MQTT broker. Defaults to mqtt://localhost if blank. Example: -b 192.168.0.123"
    )
    .helpOption("-h, --help", "Display help for command");
  options = program.parse(process.argv).opts();
  if (options.hasOwnProperty("bridgeID")) {
    bridgeID = options.bridgeID;
  } else {
    console.log("Bridge ID not specified. Generating a random bridge ID.");
    bridgeID = options.bridgeID || crypto.randomBytes(5).toString("hex");
  }
  // Get the target from the command line. Default is emulator
  if (options.hasOwnProperty("target")) {
    target = options.target;
  } else {
    console.log("Target not specified. Defaulting to emulator.");
    target = "emulator";
  }
  // Get the broker IP from the command line. Default is localhost
  if (options.hasOwnProperty("brokerIP")) {
    brokerIP = options.brokerIP;
  } else {
    console.log("Broker IP not specified. Defaulting to localhost.");
    brokerIP = "localhost";
  }

  console.log(`Bridge ID: ${bridgeID}`);
  console.log(`Target: ${target}`);
  console.log(`Broker IP: ${brokerIP}`);

  DabBridge = require("./bridge.js");

  // Connect to the MQTT broker
  this.mqttClient = mqtt.connect("mqtt://" + brokerIP, { protocolVersion: 5 });
  // Subscribe to all topics starting with dab/bridge and dab/discovery
  this.mqttClient.subscribe("dab/bridge/#", { qos: 1 });
  this.mqttClient.subscribe("dab/discovery", { qos: 1 });
  // Handle incoming messages
  this.mqttClient.on("message", async (topic, message, packet) => {
    console.log("\nReceived MQTT Message:");
    console.log(`Topic: ${topic}`);
    console.log(`Message: ${JSON.stringify(message)}`);
    console.log(`Packet: ${JSON.stringify(packet)}`);

    // Process the incoming message and wait for the response
    // Get ResponseTopic property
    const responseTopic = packet.properties.responseTopic;
    // Get correlationData property
    const correlationData = packet.properties.correlationData;
    console.log("\nPublishing Response:");
    console.log(`Topic: ${JSON.stringify(responseTopic)}`);
    console.log(`Correlation Data: ${JSON.stringify({ properties: { correlationData }})}`);
    response = await bridge.processMqttMessage(topic, message, this.mqttClient);

    // Check if the response is an array or an individual entity
    if (Array.isArray(response)) {
      for (responseIndex in response) {
        console.log(`Message: ${JSON.stringify(response[responseIndex])}`);
        this.mqttClient.publish(
          responseTopic,
          JSON.stringify(response[responseIndex]),
          JSON.stringify({ properties: { correlationData } })
        );
      }
    } else {
      console.log(`Message: ${JSON.stringify(response)}`);
      this.mqttClient.publish(
        responseTopic,
        JSON.stringify(response),
        JSON.stringify({ properties: { correlationData } })
      );
    }
  });

  let bridge = new DabBridge(bridgeID, target, brokerIP);
}

// Call the main function to execute your code
main();
