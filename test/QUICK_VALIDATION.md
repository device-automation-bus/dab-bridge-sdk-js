# Quick Validation

Use the evidence script to collect a single JSON report plus raw logs
for the bridge operations.

Script layout:

- `test/run_dab_evidence.sh`
- `test/evidence_runner/operations.sh`
- `test/evidence_runner/lib/ui.sh`
- `test/evidence_runner/lib/core.sh`

## Requirements

- `mosquitto`
- `mosquitto_pub`
- `mosquitto_sub`
- `node`
- project dependencies installed with `npm install`

## Start Services

Start an MQTT broker:

```bash
mosquitto
```

Start the bridge manually if you want to reuse an existing process:

```bash
node src/index.js -i template -b mqtt://127.0.0.1:1883
```

By default the validation script can also start the local sample bridge
for you when no bridge is already running.

## Run Full Validation

```bash
./test/run_dab_evidence.sh
```

This creates a new folder under `test/evidence/<timestamp>/`.

To force use of an already running bridge:

```bash
AUTO_START_BRIDGE=0 ./test/run_dab_evidence.sh
```

## Run One Operation

```bash
./test/run_dab_evidence.sh applications_install
```

You can also use the environment variable form:

```bash
RUN_ONLY=applications_install ./test/run_dab_evidence.sh
```

## Output Files

The main output is:

```bash
test/evidence/<timestamp>/final_results.json
```

That JSON contains:

- run metadata
- summary counts
- one structured result object per operation
- parsed response messages

Useful raw logs:

- `test/evidence/<timestamp>/console.log`
- `test/evidence/<timestamp>/requests.log`
- `test/evidence/<timestamp>/messages.log`
- `test/evidence/<timestamp>/bridge.log`

## Result Meaning

- `RESPONDED`: the operation returned at least one response
- `NOT_IMPLEMENTED`: the operation returned `501`
- `NO_RESPONSE`: no response was captured in the wait window

## Notes

- most normal operations stop after the first response
- `discovery` and `system/logs/stop-collection` allow multi-message
  capture
- the sample partner device may still return `501 Not implemented`
  for many operations, and that will be visible in the final JSON
- temporary internal files are cleaned up automatically after the
  final JSON is written
