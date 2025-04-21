#!/usr/bin/env node

if (process.env.DEBUG === '1') {
	console.error('DEBUG - dev.js received args:', process.argv.slice(2));
}

import { runCLI } from './modules/commands.js';

// Slice off the node path and script name
const args = process.argv.slice(2);

// Extract command + args
const command = args[0];
const commandArgs = args.slice(1);

// Run it
runCLI(command, commandArgs);
