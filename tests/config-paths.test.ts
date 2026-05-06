import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
	ensureSherlockHome,
	getBootstrapStatePath,
	getDefaultSessionDir,
	getSherlockAgentDir,
	getSherlockHome,
	getSherlockMemoryDir,
	getSherlockStateDir,
} from "../src/config/paths.js";

test("getSherlockHome uses SHERLOCK_AI_HOME env var when set", () => {
	const previous = process.env.SHERLOCK_AI_HOME;
	try {
		process.env.SHERLOCK_AI_HOME = "/custom/home";
		assert.equal(getSherlockHome(), resolve("/custom/home", ".sherlock-ai"));
	} finally {
		if (previous === undefined) {
			delete process.env.SHERLOCK_AI_HOME;
		} else {
			process.env.SHERLOCK_AI_HOME = previous;
		}
	}
});

test("getSherlockHome falls back to homedir when SHERLOCK_AI_HOME is unset", () => {
	const previous = process.env.SHERLOCK_AI_HOME;
	try {
		delete process.env.SHERLOCK_AI_HOME;
		const home = getSherlockHome();
		assert.ok(home.endsWith(".sherlock-ai"), `expected path ending in .sherlock-ai, got: ${home}`);
		assert.ok(!home.includes("undefined"), `expected no 'undefined' in path, got: ${home}`);
	} finally {
		if (previous === undefined) {
			delete process.env.SHERLOCK_AI_HOME;
		} else {
			process.env.SHERLOCK_AI_HOME = previous;
		}
	}
});

test("getSherlockAgentDir resolves to <home>/agent", () => {
	assert.equal(getSherlockAgentDir("/some/home"), resolve("/some/home", "agent"));
});

test("getSherlockMemoryDir resolves to <home>/memory", () => {
	assert.equal(getSherlockMemoryDir("/some/home"), resolve("/some/home", "memory"));
});

test("getSherlockStateDir resolves to <home>/.state", () => {
	assert.equal(getSherlockStateDir("/some/home"), resolve("/some/home", ".state"));
});

test("getDefaultSessionDir resolves to <home>/sessions", () => {
	assert.equal(getDefaultSessionDir("/some/home"), resolve("/some/home", "sessions"));
});

test("getBootstrapStatePath resolves to <home>/.state/bootstrap.json", () => {
	assert.equal(getBootstrapStatePath("/some/home"), resolve("/some/home", ".state", "bootstrap.json"));
});

test("ensureSherlockHome creates all required subdirectories", () => {
	const root = mkdtempSync(join(tmpdir(), "sherlock-ai-paths-"));
	try {
		const home = join(root, "home");
		ensureSherlockHome(home);

		assert.ok(existsSync(home), "home dir should exist");
		assert.ok(existsSync(join(home, "agent")), "agent dir should exist");
		assert.ok(existsSync(join(home, "memory")), "memory dir should exist");
		assert.ok(existsSync(join(home, ".state")), ".state dir should exist");
		assert.ok(existsSync(join(home, "sessions")), "sessions dir should exist");
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("ensureSherlockHome is idempotent when dirs already exist", () => {
	const root = mkdtempSync(join(tmpdir(), "sherlock-ai-paths-"));
	try {
		const home = join(root, "home");
		ensureSherlockHome(home);
		assert.doesNotThrow(() => ensureSherlockHome(home));
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
