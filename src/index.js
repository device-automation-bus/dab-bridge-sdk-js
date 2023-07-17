import config from 'config';
import {DabBridge} from "./bridge.js";

const dabBridge = new DabBridge(config.get("bridgeID"));
await dabBridge.init(config.get("mqttBroker"));

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
