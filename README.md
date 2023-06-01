# DAB <-> RDK Bridge %

This bridge enables compatibility with DAB specification to devices based on [Reference Design Kit (RDK)](https://rdkcentral.com/).
This bridge connects directly to the mqtt host on the localhost and manages multiple device through a LAN.

# Usage

```
Usage: node index.js [options]

Options:
  -t, --target <string>     Example: -t emulator
  -i, --bridgeID <string>  (Optional) The bridge-id on the network. Generates a random bridge-id
                           string if blank. Example: -i myBridge0
  -b, --brokerIP <string>  (Optional) The IP address of the MQTT broker. Defaults to localhost if
                           blank. Example: -b 192.168.0.123
  -h, --help               Display help for command
```

# Examples of use

- At this moment the bridge only connects to MQTT brokers on `localhost`.
  Please, be sure that there are RDK devices connected to your local network.

In this examples, we will obtain the responses over the topic `my/response/topic`. You can rename it to whatever name you want.c
Install `mosquitto_pub` to act as an DAB user client.

## Starting the Bridge without specifying a bridge name

```
$ node dab-bridge.js -i myBridge0
```

The software will generate a random bridge name:

```
Bridge ID: c1f08bc4d3
```

## Starting the Bridge with a given bridge name

```
$ node dab-bridge.js -i myBridge0
```

The response will be:

```
Bridge ID: myBridge0
```

## Manually adding a device to the bridge

If you know the IP of your board on your local network, add it directly to the bridge, using `mosquitto_pub` :

```
$ mosquitto_pub -t dab/bridge/myBridge0/add-device -m '{ "ip": "my.board.ip" }' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`.

## Removing a device from the bridge

To remove a device from the bridge with `mosquitto_pub` :

```
$ mosquitto_pub -t dab/bridge/myBridge0/remove-device -m '{ "ip": "my.board.ip" }' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`.

## List all devices connected to the bridge

```
$ mosquitto_pub -t dab/bridge/myBridge0/list -m '{}' -D publish response-topic "my/response/topic"
```

The result will be published in `my/response/topic`. Example:

```
{"status":200,"devices":[{"device-id":"D4CFF9768418","ip":"192.168.15.0"}]}
```

The unique device ID of our device in this example is `D4CFF9768418`.

# Sending DAB Commands

Given the device-id of our example (`D4CFF9768418`), send DAB commands:

## List the application on a device

```
mosquitto_pub -t dab/D4CFF9768418/applications/list -m '{}' -D publish response-topic "my/response/topic"
```

## Start an application on a device

```
mosquitto_pub -t dab/D4CFF9768418/applications/launch -m '{ "appId": "Cobalt" }' -D publish response-topic "my/response/topic"
```

## Close an application on a device

```
mosquitto_pub -t dab/D4CFF9768418/applications/exit -m '{ "appId": "Cobalt" }' -D publish response-topic "my/response/topic"
```
