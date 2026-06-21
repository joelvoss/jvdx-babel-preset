#!/bin/bash

set -e
PATH=./node_modules/.bin:$PATH

format() {
	printf 'Formatting...\n'
	npx prettier --write index.js plugins/*.js package.json
}

validate() {
	printf 'Running tests...\n'
	npm test
}

help() {
	printf 'Usage: %s <command>\n' "$0"
	printf '\nCommands:\n'
	printf '  format    Format source files\n'
	printf '  validate  Run validation\n'
	printf '  help      Show help\n'
}

${@:-help}
