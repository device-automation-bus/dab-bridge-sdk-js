#!/usr/bin/env bash

UI_IS_TTY=0
if [[ -t 1 ]]; then
    UI_IS_TTY=1
fi

ui_init_colors() {
    if [[ "$UI_IS_TTY" -eq 1 ]]; then
        UI_RESET=$'\033[0m'
        UI_BOLD=$'\033[1m'
        UI_DIM=$'\033[2m'
        UI_BLUE=$'\033[34m'
        UI_GREEN=$'\033[32m'
        UI_RED=$'\033[31m'
        UI_YELLOW=$'\033[33m'
        UI_CYAN=$'\033[36m'
        UI_GRAY=$'\033[90m'
    else
        UI_RESET=''
        UI_BOLD=''
        UI_DIM=''
        UI_BLUE=''
        UI_GREEN=''
        UI_RED=''
        UI_YELLOW=''
        UI_CYAN=''
        UI_GRAY=''
    fi
}

ui_now() {
    date -u +%Y-%m-%dT%H:%M:%SZ
}

ui_write_line() {
    printf '%s\n' "$1"
}

ui_banner() {
    local title="$1"
    ui_write_line "${UI_BOLD}${UI_CYAN}==>${UI_RESET} ${UI_BOLD}${title}${UI_RESET}"
}

ui_log() {
    local text="$1"
    ui_write_line "$(ui_now) | $text"
}

ui_gtest_run() {
    local name="$1"
    ui_write_line "${UI_BLUE}[ RUN      ]${UI_RESET} ${name}"
}

ui_gtest_ok() {
    local name="$1"
    local result="$2"
    local statuses="$3"
    ui_write_line "${UI_GREEN}[       OK ]${UI_RESET} ${name} ${UI_DIM}(result=${result} statuses=${statuses})${UI_RESET}"
}

ui_gtest_warn() {
    local name="$1"
    local result="$2"
    local statuses="$3"
    ui_write_line "${UI_YELLOW}[  NOTICE  ]${UI_RESET} ${name} ${UI_DIM}(result=${result} statuses=${statuses})${UI_RESET}"
}

ui_gtest_fail() {
    local name="$1"
    local result="$2"
    ui_write_line "${UI_RED}[  FAILED  ]${UI_RESET} ${name} ${UI_DIM}(result=${result})${UI_RESET}"
}

ui_skip() {
    local name="$1"
    ui_write_line "${UI_GRAY}[  SKIPPED ]${UI_RESET} ${name}"
}

ui_kv() {
    local key="$1"
    local value="$2"
    ui_write_line "${UI_DIM}${key}:${UI_RESET} ${value}"
}

ui_spinner_wait() {
    local pid="$1"
    local label="$2"
    local frames='|/-\'
    local i=0

    if [[ "$UI_IS_TTY" -ne 1 ]]; then
        wait "$pid"
        return $?
    fi

    while kill -0 "$pid" >/dev/null 2>&1; do
        local frame="${frames:i%${#frames}:1}"
        printf '\r%s[   WAIT   ]%s %s %s' \
            "$UI_CYAN" "$UI_RESET" "$label" "$frame"
        sleep 0.1
        i=$((i + 1))
    done

    wait "$pid"
    local rc=$?
    printf '\r\033[K'
    return "$rc"
}

ui_init_colors
