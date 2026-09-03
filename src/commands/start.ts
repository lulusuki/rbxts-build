import yargs from "yargs";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";
import { getPackageManager } from "../util/getPackageManager";
import { isHeadless } from "../util/isHeadless";

const command = "start";
const describe = "Compile, build, and open Studio; skip watch processes when headless";

interface StartArgs {
	watch?: boolean;
	suffix?: string;
}

const builder: yargs.CommandBuilder<Record<string, never>, StartArgs> = {
	watch: {
		type: "boolean",
		description: "Start rbxtsc --watch and rojo serve (defaults off when stdin or stdout is not a TTY)",
	},
};

async function handler(args: yargs.Arguments<StartArgs>) {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);
	const headless = isHeadless();
	const watch = args.watch ?? (headless ? false : undefined);
	const pm = getPackageManager();
	const { suffix } = args;

	await run(pm, ["run", getCommandName(settings, "compile", suffix)]);
	await run(pm, ["run", getCommandName(settings, "build", suffix)]);

	const openArgs = ["run", getCommandName(settings, "open", suffix)];
	if (watch !== undefined) {
		openArgs.push("--", watch ? "--watch" : "--no-watch");
	}

	if (headless && watch === false) {
		const watchCommand = getCommandName(settings, "watch", suffix);
		console.log(
			`Headless session detected; opening Studio without starting watch. Run "${pm} run ${watchCommand}" to start rbxtsc --watch and rojo serve.`,
		);
	}

	await run(pm, openArgs);
}

export = identity<yargs.CommandModule<Record<string, never>, StartArgs>>({ command, describe, builder, handler });
