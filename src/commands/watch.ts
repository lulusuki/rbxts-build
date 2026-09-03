import yargs from "yargs";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { platform } from "../util/runPlatform";

const command = "watch";
const describe = "Run rbxtsc in watch mode and serve the project with Rojo";

interface WatchArgs {
	tsconfig?: string;
	port?: number;
}

const builder: yargs.CommandBuilder<Record<string, never>, WatchArgs> = {
	tsconfig: {
		alias: "t",
		type: "string",
		description: "Path to tsconfig file passed to rbxtsc via -p (relative to --path)",
	},
	port: {
		alias: "P",
		type: "number",
		description: "Port for rojo serve",
	},
};

async function handler(args: yargs.Arguments<WatchArgs>) {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	const rojo = platform === "linux" && settings.wslUseExe ? "rojo.exe" : "rojo";
	const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
	const rbxtscArgs = args.tsconfig
		? ["-w", "-p", args.tsconfig]
		: ["-w"].concat(settings.rbxtscArgs ?? []);
	const rojoServeArgs = ["serve", ...(args.port ? ["--port", String(args.port)] : [])];
	run(rojo, rojoServeArgs).catch(console.warn);
	run(rbxtsc, rbxtscArgs).catch(console.warn);
}

export = identity<yargs.CommandModule<Record<string, never>, WatchArgs>>({ command, describe, builder, handler });
