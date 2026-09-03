import path from "path";
import yargs from "yargs";
import { PLACEFILE_NAME } from "../constants";
import { getSettings } from "../util/getSettings";
import { getCommandName } from "../util/getCommandName";
import { getPackageManager } from "../util/getPackageManager";
import { getWindowsPath } from "../util/getWindowsPath";
import { identity } from "../util/identity";
import { run } from "../util/run";
import { runPlatform } from "../util/runPlatform";

const command = "open";
const describe = "Open game.rbxl in Roblox Studio and optionally start watch processes";

interface OpenArgs {
	watch?: boolean;
	suffix?: string;
}

const builder: yargs.CommandBuilder<Record<string, never>, OpenArgs> = {
	watch: {
		type: "boolean",
		description: "Start rbxtsc --watch and rojo serve after Studio opens (defaults to watchOnOpen)",
	},
};

async function handler(args: yargs.Arguments<OpenArgs>) {
	const projectPath = process.cwd();
	const settings = await getSettings(projectPath);

	await runPlatform({
		darwin: () => run("open", [PLACEFILE_NAME]),
		linux: async () => {
			const fsPath = await getWindowsPath(path.join(projectPath, PLACEFILE_NAME));
			return run("powershell.exe", ["/c", `start ${fsPath}`]);
		},
		win32: () => run("start", [PLACEFILE_NAME]),
	});

	const watch = args.watch ?? settings.watchOnOpen ?? true;
	if (watch) {
		await run(getPackageManager(), ["run", getCommandName(settings, "watch", args.suffix), "--silent"]);
	}
}

export = identity<yargs.CommandModule<Record<string, never>, OpenArgs>>({ command, describe, builder, handler });
