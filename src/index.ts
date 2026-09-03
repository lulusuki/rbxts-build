#!/usr/bin/env node

import path from "path";
import yargs from "yargs";
import { PACKAGE_ROOT, VERSION } from "./constants";
import { CLIError } from "./errors/CLIError";

void yargs
	.usage("rbxts-build - A build tool for roblox-ts")
	.help("help")
	.alias("h", "help")
	.showHelpOnFail(false)
	.describe("help", "show help information")

	// version
	.version(VERSION)
	.alias("v", "version")

	// global options
	.option("path", {
		alias: "p",
		type: "string",
		description: "Working directory to run the command in",
		global: true,
	})
	.option("suffix", {
		alias: "s",
		type: "string",
		description: "Suffix appended to internal script names (e.g. 'standard' → 'compile:standard')",
		global: true,
	})
	.middleware((args: { path?: string }) => {
		if (args.path) {
			process.chdir(path.resolve(args.path));
		}
	})

	// commands
	.commandDir(`${PACKAGE_ROOT}/out/commands`)

	// options
	.recommendCommands()
	.strict()
	.wrap(yargs.terminalWidth())

	.fail((str, e) => {
		process.exitCode = 1;
		if (e instanceof CLIError) {
			e.log();
		} else {
			if (str !== undefined && str !== null) console.log(str);
			if (e) console.log(e);
		}
		debugger;
	})

	// execute
	.parse();
