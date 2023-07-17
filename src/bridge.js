const { default: request } = require("sync-request");
const Ajv = require("ajv");

const JS_BRIDGE_MAJOR_VERSION = 0,
    JS_BRIDGE_MINOR_VERSION = 1,
    JS_BRIDGE_PATCH_VERSION = 0;

class DabBridge {
  constructor(bridgeID, device) {
    this.target = device;
    this.bridgeID = bridgeID;
    this.deviceCounter = 0;
    // Create a device table
    this.deviceTable = new DeviceTable();
  }

  async processMqttMessage(topic, message, mqttClient) {
    // Get topic structure
    const topicStructure = Array.from(topic.split("/"));
    // Get the messageRoute from the topic
    const messageRoute = topicStructure[1];
    // Get the params from the message
    console.log(message);
    // Check if this is a operation for a bridge. If not, check if this is a operation for a device

    // TODO fix this design, MQTT routes shouldn't be broadly subscribed to and processed like this.
    switch (messageRoute) {
      case "bridge":
        return await this.handleBridgeRoute(topic, message, mqttClient);
      case "discovery": // Unique route that requires the bridge to take action for all devices it is managing
        let discoveryResponses = [];

        for (const [entryDeviceID, entryIP] of this.deviceTable.getAllDevices()) {
          console.log(entryDeviceID + " " + entryIP);
          discoveryResponses.push({"status": 200, "deviceId": entryDeviceID, "ip": entryIP});
        }

        return discoveryResponses;// Get the operation from the topic
        break;

      default: // Regular DAB operation to translate with partner implementation
        let dabOperation = topicStructure.slice(2, topicStructure.length).join("/");
        let params = JSON.parse(message.toString());
        return await this.processDabOperation(this.deviceTable.getIp(messageRoute), dabOperation, params);
        break;
    }

    return null;
  }

  async handleBridgeRoute(topic, message, mqttClient){

    const topicStructure = Array.from(topic.split("/"));
    console.log("Received message from topic -- " + topic)
    const params = JSON.parse(message.toString());

    // This is an operation for a bridge. Check if this is a operator for this bridge instance
    let targetBridge = topicStructure[2];
    if (targetBridge === this.bridgeID) {
      // Get the operation from the topic
      let bridgeOperation = topicStructure[3];
      switch (bridgeOperation) {
        case "add-device": // Perform a health check using partner implementation before adding device
          if (params.skipValidation !== true) {
            let healthCheckResponse = await this.processDabOperation(params.ip, "health-check/get", {});
            if (healthCheckResponse.status !== 200) return {
              "status": 400,
              "error": "Partner device health check failed."
            };
          }
          // Implements dab/bridge/<bridgeID>/add-device operation
          if (!this.deviceTable.isIpAdded(params.ip)) {
            let newDeviceID = "device" + this.deviceCounter;
            this.deviceCounter++;
            this.deviceTable.addDevice(newDeviceID, params.ip);
            // Subscribe to messages for this device ID
            mqttClient.subscribe(`dab/${newDeviceID}/#`, {qos: 1});
            console.log(`Subscribed to the topic: dab/${newDeviceID}/#`);
            return {"status": 200, "deviceId": `${newDeviceID}`};
          } else {
            return {"status": 400, "error": "IP already added"};
          }
          break;

        case "remove-device": // Implements dab/bridge/<bridgeID>/remove-device operation
          if (!this.deviceTable.removeDeviceWithIP(params.ip)) {
            return {"status": 400, "error": `The requested device ${params.ip} is not recorded in the bridge.`};
          } else {
            return {"status": 200};
          }
          break;

        case "list-devices": // Implements dab/bridge/<bridgeID>/list-devices operation
          return {"status": 200, "devices": this.deviceTable.getAllDevices()};
          break;

        case "version":
          return {"status": 200, "version": `${JS_BRIDGE_MAJOR_VERSION}.${JS_BRIDGE_MINOR_VERSION}.${JS_BRIDGE_PATCH_VERSION}`};
          break;

        default:
          return {"status": 501, "error": "The requested functionality is not implemented."};
      }
    }

    return null;
  }

  async processDabOperation(deviceIp, dabOperation, params) {
    let structMap = require("./structsMap.js");
    if(!structMap[dabOperation]){
      console.log("Ignoring unsupported DAB operation --> " + dabOperation);
      // TODO: This trick for not responding to unknown DAB operations will be removed
      // TODO: once the current MQTT listener architecture is re-designed and fixed
      return null;
    }

    let structFile = structMap[dabOperation];
    let dabStruct = require(structFile);

    // const ajv = new Ajv();

    // const validate = ajv.compile(dabStruct);

    // if (!validate(params)) {
    // 	return { "status": 500, "error": validate.errors };
    // }

    const interfacePath = "./device/" + this.target + "/interface.js";
    const functionMap = require(interfacePath);
    const functionPath =
      "./device/" + this.target + "/" + functionMap[dabOperation];
    const functionProcess = require(functionPath);
    return await functionProcess(deviceIp, params);
  }
}

class DeviceTable {
  constructor() {
    this.map = {};
  }
  // Add a device-IP pair to the table
  addDevice = (deviceId, IP) => (this.map[deviceId] = IP);
  // Get the IP associated with a device
  getIp = (deviceId) => this.map[deviceId];
  // Check if the table contains a device by its ip
  isIpAdded = (ip) => {
    for (const key in this.map) {
      if (this.map[key] === ip) {
        return true;
      }
    }
    return false;
  };
  // Check if the table contains a device by its name
  isDeviceAdded = (deviceId) => deviceId in this.map;

  // Removes a device-IP pair from the table
  removeDeviceWithIP = (IP) => {
    let targetDeviceId = null;
    for (const deviceId in this.map) {
      if (this.map[deviceId] === IP) {
        delete this.map[deviceId]; // Remove current property
        return true;
      }
    }
    return false;
  }
  // Get all the entries in the table
  getAllDevices = () => Object.entries(this.map);
}

module.exports = DabBridge;
