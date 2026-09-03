import yargs from "yargs";
import { getSettings } from "../util/getSettings";
import { identity } from "../util/identity";
import { run } from "../util/run";

const command = "compile";
const describe = "Compile the project with rbxtsc";

interface CompileArgs {
	tsconfig?: string;
}

const builder: yargs.CommandBuilder<Record<string, never>, CompileArgs> = {
	tsconfig: {
		alias: "t",
		type: "string",
		description: "Path to tsconfig file passed to rbxtsc via -p (relative to --path)",
	},
};

async function handler(args: yargs.Arguments<CompileArgs>) {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	const rbxtsc = settings.dev ? "rbxtsc-dev" : "rbxtsc";
	const rbxtscArgs = args.tsconfig
		? ["-p", args.tsconfig]
		: (settings.rbxtscArgs ?? ["--verbose"]);
	await run(rbxtsc, rbxtscArgs);
}

export = identity<yargs.CommandModule<Record<string, never>, CompileArgs>>({ command, describe, builder, handler });
