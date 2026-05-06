import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

export function getSherlockHome(): string {
	return resolve(process.env.SHERLOCK_AI_HOME ?? homedir(), ".sherlock-ai");
}

export function getSherlockAgentDir(home = getSherlockHome()): string {
	return resolve(home, "agent");
}

export function getSherlockMemoryDir(home = getSherlockHome()): string {
	return resolve(home, "memory");
}

export function getSherlockStateDir(home = getSherlockHome()): string {
	return resolve(home, ".state");
}

export function getDefaultSessionDir(home = getSherlockHome()): string {
	return resolve(home, "sessions");
}

export function getBootstrapStatePath(home = getSherlockHome()): string {
	return resolve(getSherlockStateDir(home), "bootstrap.json");
}

export function ensureSherlockHome(home = getSherlockHome()): void {
	for (const dir of [
		home,
		getSherlockAgentDir(home),
		getSherlockMemoryDir(home),
		getSherlockStateDir(home),
		getDefaultSessionDir(home),
	]) {
		mkdirSync(dir, { recursive: true });
	}
}
