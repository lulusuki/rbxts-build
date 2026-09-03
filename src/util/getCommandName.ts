import { packageJsonType } from "../typeChecks";

export function getCommandName(settings: packageJsonType["rbxts-build"], command: string, suffix?: string) {
	const name = settings?.names?.[command] ?? command;
	return suffix ? `${name}:${suffix}` : name;
}
