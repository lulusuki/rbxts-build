import { packageJsonType } from "../typeChecks";
import fs from "fs/promises";
import path from "path";

async function findPackageJson(startPath: string): Promise<string | null> {
	let current = path.resolve(startPath);
	while (true) {
		const pkgPath = path.join(current, "package.json");
		try {
			await fs.access(pkgPath);
			return pkgPath;
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
		}
	}
}

export async function getSettings(projectPath: string) {
	const pkgJsonPath = await findPackageJson(projectPath);
	if (!pkgJsonPath) return {};
	const pkgJsonContents = (await fs.readFile(pkgJsonPath)).toString();
	const pkgJson = packageJsonType.parse(JSON.parse(pkgJsonContents));
	return pkgJson?.["rbxts-build"] ?? {};
}
