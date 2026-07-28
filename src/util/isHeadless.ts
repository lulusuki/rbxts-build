export function isHeadless() {
	return process.stdin.isTTY !== true || process.stdout.isTTY !== true;
}
