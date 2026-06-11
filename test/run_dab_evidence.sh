#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$ROOT_DIR/evidence_runner/lib/ui.sh"
source "$ROOT_DIR/evidence_runner/lib/core.sh"
source "$ROOT_DIR/evidence_runner/operations.sh"

BROKER_URI="${BROKER_URI:-mqtt://127.0.0.1:1883}"
BRIDGE_ID="${BRIDGE_ID:-template}"
DEVICE_ID="${DEVICE_ID:-test-device}"
DEVICE_IP="${DEVICE_IP:-127.0.0.1}"
LOG_ROOT="${LOG_ROOT:-test/evidence}"
RUN_ID="${RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
WAIT_SHORT="${WAIT_SHORT:-3}"
WAIT_MEDIUM="${WAIT_MEDIUM:-8}"
WAIT_LONG="${WAIT_LONG:-20}"
AUTO_START_BRIDGE="${AUTO_START_BRIDGE:-1}"
BRIDGE_READY_WAIT="${BRIDGE_READY_WAIT:-15}"
RUN_ONLY="${RUN_ONLY:-${1:-all}}"

MQTT_HOST=""
MQTT_PORT=""
MESSAGES_PID=""

check_dep mosquitto_pub
check_dep mosquitto_sub
check_dep python3

parse_broker_uri
prepare_paths

trap cleanup_runner EXIT

ui_banner "DAB Quick Validation"
ui_kv "Broker" "$BROKER_URI"
ui_kv "Bridge" "$BRIDGE_ID"
ui_kv "Device" "$DEVICE_ID"
ui_kv "Run only" "$RUN_ONLY"
ui_kv "Auto start bridge" "$AUTO_START_BRIDGE"
ui_kv "Logs" "$LOG_DIR"

runner_log "Starting evidence run in $LOG_DIR"
runner_log "Broker: $BROKER_URI"
runner_log "Bridge: $BRIDGE_ID"
runner_log "Device: $DEVICE_ID"
runner_log "Run only: $RUN_ONLY"
runner_log "Auto start bridge: $AUTO_START_BRIDGE"

start_bridge_if_needed
start_message_capture
load_operations

for definition in "${OPERATIONS[@]}"; do
    IFS='|' read -r name topic payload wait_seconds mode <<<"$definition"
    run_operation "$name" "$topic" "$payload" "$wait_seconds" "$mode"
done

write_final_report

ui_banner "Run Complete"
ui_kv "Final JSON" "$FINAL_JSON"
ui_kv "Console Log" "$CONSOLE_LOG"
ui_kv "Requests Log" "$REQ_LOG"
ui_kv "Messages Log" "$MESSAGE_LOG"
ui_kv "Bridge Log" "$BRIDGE_LOG"

runner_log "Evidence run completed"
runner_log "Final JSON: $FINAL_JSON"
runner_log "Console Log: $CONSOLE_LOG"
runner_log "Requests Log: $REQ_LOG"
runner_log "Messages Log: $MESSAGE_LOG"
runner_log "Bridge Log: $BRIDGE_LOG"
