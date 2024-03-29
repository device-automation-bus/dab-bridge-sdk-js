import {Command} from "commander";
import {DabBridge} from "./bridge.js";

let bridgeID, brokerURI;
parseCLIParams();

const dabBridge = new DabBridge(bridgeID);
await dabBridge.init(brokerURI);

/**
 * Handle Node termination cleanly
 */
process.on("SIGTERM", async () => {
    console.log("Caught SIGTERM...");
    await dabBridge.stop();
    process.exit(0);
});

// catch ctrl+c event and exit normally
process.on("SIGINT", async () => {
    console.log("Caught SIGTINT...");
    await dabBridge.stop();
    process.exit(0);
});

//catch uncaught exceptions, trace, then exit normally
process.on("uncaughtException", async (e) => {
    console.log("Uncaught Exception...");
    console.log(e.stack);
    await dabBridge.stop();
    process.exit(0);
});

function parseCLIParams() {
    // Parse command line arguments using Commander
    const program = new Command();

    program
        .option(
            "-i, --bridgeID <string>",
            "The bridge-id on the network. Generates a random bridge-id string if unspecified. " +
            "Example: -i myPartnerBridgeName | (Optional)",
            "template"
        )
        .option(
            "-b, --brokerURI <string>",
            "The URI of the MQTT broker. " +
            "Defaults to mqtt://localhost:1883 if unspecified. Example: -b http://192.168.1.123 (Optional)",
            "mqtt://127.0.0.1:1883"
        )
        .helpOption("-h, --help", "Display help for command");
    let options = program.parse(process.argv).opts();
    bridgeID = options.bridgeID;
    brokerURI = options.brokerURI;

    if (!options.hasOwnProperty("bridgeID"))
        console.log(`Bridge ID not specified. Defaulting to ${bridgeID}`);

    if (!options.hasOwnProperty("brokerURI"))
        console.log(`Broker URI not specified. Defaulting to ${brokerURI}.`);

    console.log(`Bridge ID: ${bridgeID}`);
    console.log(`MQTT Broker URI: ${brokerURI}`);
}
