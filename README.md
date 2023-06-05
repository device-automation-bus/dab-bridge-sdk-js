# DAB Bridge SDK

This project is a reference template that can be used to develop a DAB Bridge that is compliant with the DAB specification.

More details on the general usage for DAB Bridges can be found in the DAB User Guide.

## Structure Overview

This bridge is split into two primary components:

- Bridge Specific Components
- Partner DAB Operations Implementation

This bridge is designed such that a DAB Partner only needs to fill in their implementation of various DAB operations.

The MQTT5 request-response model, parsing parameters, routing to appropriate files, multiple device management, and other boiler-plate code is already implemented within the bridge specific components.

The partner specific implementation component is located under `src/device`. A sample `template` implementation has been provided for reference.

## Implementation Steps

1. Fork or clone this repository
2. Install all dependencies with `npm install`
3. Navigate to `src/device`
4. Make a copy of the `template` folder and name it the manufactuer name for your devices.
5. Implement each DAB operation within each file as per the specfication. Input parsing and output delivery is already handled by the bridge.
6. Run the DAB Bridge with your device target implementation using `node src/index.js -t <manufacturer-name> -i <bridge-name> -b <mqtt-broker-ip>`
7. Onboard your real device using the device management operations specified below and begin using DAB operations.

Run sanity unit tests using `npm run test`, and use the Compliance Suite tool to run tests end-to-end with the device.

## CLI Parameters

```
❯ node index.js --help
DAB Bridge
Usage: index [options]

Options:
  -t, --target <string>     Example: -t emulator
  -i, --bridgeID <string>  (Optional) The bridge-id on the network. Generates a random bridge-id string if
                           blank. Example: -i myBridge0
  -b, --brokerIP <string>  (Optional) The IP address of the MQTT broker. Defaults to mqtt://localhost if blank.
                           Example: -b 192.168.0.123
  -h, --help               Display help for command
```

### Examples

In these examples, we specify the response topic as `my/response/topic`.

Install `mosquitto_pub` to act as an DAB user client.

### Adding a device to the bridge

If you know the IP of your board on your local network, add it directly to the bridge, using `mosquitto_pub` :

```
$ mosquitto_pub -t dab/bridge/<bridge-name>/add-device -m '{ "ip": "<device-ip>" }' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`.

```
{
    "status": 200,
    "deviceID": <dab-device-id>
}
```

### Removing a device from the bridge

To remove a device from the bridge with `mosquitto_pub` :

```
$ mosquitto_pub -t dab/bridge/<bridge-name>/remove-device -m '{ "ip": "<device-ip>" }' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`.

### List all devices connected to the bridge

```
$ mosquitto_pub -t dab/bridge/<bridge-name>/list -m '{}' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`. Example:

```
{"status":200,"devices":[{"device-id":"device0","ip":"192.168.15.0"}]}
```

The unique device ID of our device in this example is `device0`.

### Sending DAB Commands

Given the DAB deviceID of our example (`device0`), send DAB commands like so:

#### List applications on a device

```
mosquitto_pub -t dab/device0/applications/list -m '{}' -D publish response-topic "my/response/topic"
```

#### Start an application on a device

```
mosquitto_pub -t dab/device0/applications/launch -m '{ "appId": "Cobalt" }' -D publish response-topic "my/response/topic"
```

#### Close an application on a device

```
mosquitto_pub -t dab/device0/applications/exit -m '{ "appId": "Cobalt" }' -D publish response-topic "my/response/topic"
```
