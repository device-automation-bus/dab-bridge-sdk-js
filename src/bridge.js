const { default: request } = require("sync-request");
const Ajv = require("ajv");

class dabBridge {
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
    // Get the deviceId from the topic
    const deviceId = topicStructure[1];
    // Get the params from the message
    const params = JSON.parse(message.toString());

    // Check if this is a operation for a bridge. If not, check if this is a operation for a device
    let dabOperation = "";
    if (deviceId == "bridge") {
      // This is a operation for a bridge. Check if this is a operator for this bridge instance
      let targetBridge = topicStructure[2];
      if (targetBridge == this.bridgeID) {
        // Get the operation from the topic
        let brigeOperation = topicStructure[3];
        if (brigeOperation == "add-device") {
          // Implements dab/bridge/<bridgeID>/add-device operation
          if (!this.deviceTable.isIpAdded(params.ip)) {
            let newDeviceID = "device" + this.deviceCounter;
            this.deviceCounter++;
            this.deviceTable.addDevice(newDeviceID, params.ip);
            // Subscribe to messages for this device ID
            mqttClient.subscribe(`dab/${newDeviceID}/#`, { qos: 1 });
            console.log(`Subscribed to the topic: dab/${newDeviceID}/#`);
            return {"status":200, "deviceID":`${newDeviceID}`};
          } else {
            return '{"status":500, "error":"IP already added"}';
          }
        } else if (brigeOperation == "remove-device") {
          // Implements dab/bridge/<bridgeID>/remove-device operation
          if (!this.deviceTable.isIpAdded(params.ip)) {
            return `{"status":501, "error":"The requested device ${params.ip} is not recorded in the bridge."}`;
          } else {
            this.deviceTable.removeDevice("dummyDeviceID");
            return '{"status":200}';
          }
        } else if (brigeOperation == "list-devices") {
          // Implements dab/bridge/<bridgeID>/list-devices operation
          return (
            '{"status":200, "devices":' +
            JSON.stringify(this.deviceTable.getAllDevices()) +
            "}"
          );
        } else {
          return '{"status":501, "error":"The requested functionality is not implemented."}';
        }
      }
    } else if (deviceId === "discovery") {
      return await this.processDabOperation("", "discovery", params);
    } else {
      // This is a operator for a device. Check if this is a operator for a device added to this bridge
      if (this.deviceTable.isDeviceAdded(deviceId)) {
        // Get the operation from the topic
        dabOperation = topicStructure.slice(2, topicStructure.length).join("/");
        return await this.processDabOperation(deviceId, dabOperation, params);
      }
    }

    return 0;
  }

  async processDabOperation(deviceId, dabOperation, params) {
    let structMap = require("./structsMap.js");
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
    response = await functionProcess(deviceId, params);
    return response;
  }
}

class DeviceTable {
  constructor() {
    this.map = {};
  }
  // Add a device-IP pair to the table
  addDevice = (device, IP) => (this.map[device] = IP);
  // Get the IP associated with a device
  getIp = (device) => this.map[device];
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
  isDeviceAdded = (device) => device in this.map;
  // Remove a device-IP pair from the table
  removeDevice = (device) => delete this.map[device];
  // Get all the entries in the table
  getAllDevices = () => Object.entries(this.map);
}

module.exports = dabBridge;
