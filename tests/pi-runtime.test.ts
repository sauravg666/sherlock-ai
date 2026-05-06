import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

import { applySherlockPackageManagerEnv, buildPiArgs, buildPiEnv, resolvePiPaths, toNodeImportSpecifier } from "../src/pi/runtime.js";

test("buildPiArgs includes configured runtime paths and prompt", () => {
	const args = buildPiArgs({
		appRoot: "/repo/sherlock-ai",
		workingDir: "/workspace",
		sessionDir: "/sessions",
		sherlockAgentDir: "/home/.sherlock-ai/agent",
		mode: "rpc",
		initialPrompt: "hello",
		explicitModelSpec: "openai:gpt-5.4",
		thinkingLevel: "medium",
	});

	assert.deepEqual(args, [
		"--session-dir",
		"/sessions",
		"--extension",
		"/repo/sherlock-ai/extensions/research-tools.ts",
		"--prompt-template",
		"/repo/sherlock-ai/prompts",
		"--mode",
		"rpc",
		"--model",
		"openai:gpt-5.4",
		"--thinking",
		"medium",
		"hello",
	]);
});

test("buildPiArgs omits thinking arg when launch thinking is not explicit", () => {
	const args = buildPiArgs({
		appRoot: "/repo/sherlock-ai",
		workingDir: "/workspace",
		sessionDir: "/sessions",
		sherlockAgentDir: "/home/.sherlock-ai/agent",
		mode: "rpc",
		initialPrompt: "hello",
	});

	assert.equal(args.includes("--thinking"), false);
});

test("buildPiEnv wires Sherlock paths into the Pi environment", () => {
	const previousUppercasePrefix = process.env.NPM_CONFIG_PREFIX;
	const previousLowercasePrefix = process.env.npm_config_prefix;
	const previousOtelServiceName = process.env.OTEL_SERVICE_NAME;
	const previousOtelServiceVersion = process.env.OTEL_SERVICE_VERSION;
	const previousPiOtelServiceName = process.env.PI_OTEL_SERVICE_NAME;
	const previousPiOtelServiceVersion = process.env.PI_OTEL_SERVICE_VERSION;
	process.env.NPM_CONFIG_PREFIX = "/tmp/global-prefix";
	process.env.npm_config_prefix = "/tmp/global-prefix-lower";
	delete process.env.OTEL_SERVICE_NAME;
	delete process.env.OTEL_SERVICE_VERSION;
	delete process.env.PI_OTEL_SERVICE_NAME;
	delete process.env.PI_OTEL_SERVICE_VERSION;

	const env = buildPiEnv({
		appRoot: "/repo/sherlock-ai",
		workingDir: "/workspace",
		sessionDir: "/sessions",
		sherlockAgentDir: "/home/.sherlock-ai/agent",
		sherlockVersion: "0.1.5",
	});

	try {
		assert.equal(env.SHERLOCK_AI_SESSION_DIR, "/sessions");
		assert.equal(env.SHERLOCK_AI_BIN_PATH, "/repo/sherlock-ai/bin/sherlock-ai.js");
		assert.equal(env.SHERLOCK_AI_PI_CLI_PATH, "/repo/sherlock-ai/node_modules/@mariozechner/pi-coding-agent/dist/cli.js");
		assert.equal(env.SHERLOCK_AI_MEMORY_DIR, "/home/.sherlock-ai/memory");
		assert.equal(env.SHERLOCK_AI_NPM_PREFIX, "/home/.sherlock-ai/npm-global");
		assert.equal(env.NPM_CONFIG_PREFIX, "/home/.sherlock-ai/npm-global");
		assert.equal(env.npm_config_prefix, "/home/.sherlock-ai/npm-global");
		assert.equal(env.SHERLOCK_AI_CODING_AGENT_DIR, "/home/.sherlock-ai/agent");
		assert.equal(env.PI_CODING_AGENT_DIR, "/home/.sherlock-ai/agent");
		assert.equal(env.OTEL_SERVICE_NAME, undefined);
		assert.equal(env.OTEL_SERVICE_VERSION, undefined);
		assert.ok(
			env.PATH?.startsWith(
				"/repo/sherlock-ai/node_modules/.bin:/repo/sherlock-ai/.sherlock-ai/npm/node_modules/.bin:/home/.sherlock-ai/npm-global/bin:",
			),
		);
	} finally {
		if (previousUppercasePrefix === undefined) {
			delete process.env.NPM_CONFIG_PREFIX;
		} else {
			process.env.NPM_CONFIG_PREFIX = previousUppercasePrefix;
		}
		if (previousLowercasePrefix === undefined) {
			delete process.env.npm_config_prefix;
		} else {
			process.env.npm_config_prefix = previousLowercasePrefix;
		}
		if (previousOtelServiceName === undefined) {
			delete process.env.OTEL_SERVICE_NAME;
		} else {
			process.env.OTEL_SERVICE_NAME = previousOtelServiceName;
		}
		if (previousOtelServiceVersion === undefined) {
			delete process.env.OTEL_SERVICE_VERSION;
		} else {
			process.env.OTEL_SERVICE_VERSION = previousOtelServiceVersion;
		}
		if (previousPiOtelServiceName === undefined) {
			delete process.env.PI_OTEL_SERVICE_NAME;
		} else {
			process.env.PI_OTEL_SERVICE_NAME = previousPiOtelServiceName;
		}
		if (previousPiOtelServiceVersion === undefined) {
			delete process.env.PI_OTEL_SERVICE_VERSION;
		} else {
			process.env.PI_OTEL_SERVICE_VERSION = previousPiOtelServiceVersion;
		}
	}
});

test("buildPiEnv uses pre-resolved executable paths when provided", () => {
	const paths = resolvePiPaths("/repo/sherlock-ai");
	const env = buildPiEnv(
		{
			appRoot: "/repo/sherlock-ai",
			workingDir: "/workspace",
			sessionDir: "/sessions",
			sherlockAgentDir: "/home/.sherlock-ai/agent",
		},
		paths,
		{
			pandoc: "/opt/test/bin/pandoc",
			mermaid: "/opt/test/bin/mmdc",
			browser: "/opt/test/bin/chrome",
		},
	);

	assert.equal(env.PANDOC_PATH, "/opt/test/bin/pandoc");
	assert.equal(env.MERMAID_CLI_PATH, "/opt/test/bin/mmdc");
	assert.equal(env.PUPPETEER_EXECUTABLE_PATH, "/opt/test/bin/chrome");
});

test("applySherlockPackageManagerEnv pins npm globals to the Sherlock prefix", () => {
	const previousSherlockPrefix = process.env.SHERLOCK_AI_NPM_PREFIX;
	const previousUppercasePrefix = process.env.NPM_CONFIG_PREFIX;
	const previousLowercasePrefix = process.env.npm_config_prefix;

	try {
		const prefix = applySherlockPackageManagerEnv("/home/.sherlock-ai/agent");

		assert.equal(prefix, "/home/.sherlock-ai/npm-global");
		assert.equal(process.env.SHERLOCK_AI_NPM_PREFIX, "/home/.sherlock-ai/npm-global");
		assert.equal(process.env.NPM_CONFIG_PREFIX, "/home/.sherlock-ai/npm-global");
		assert.equal(process.env.npm_config_prefix, "/home/.sherlock-ai/npm-global");
	} finally {
		if (previousSherlockPrefix === undefined) {
			delete process.env.SHERLOCK_AI_NPM_PREFIX;
		} else {
			process.env.SHERLOCK_AI_NPM_PREFIX = previousSherlockPrefix;
		}
		if (previousUppercasePrefix === undefined) {
			delete process.env.NPM_CONFIG_PREFIX;
		} else {
			process.env.NPM_CONFIG_PREFIX = previousUppercasePrefix;
		}
		if (previousLowercasePrefix === undefined) {
			delete process.env.npm_config_prefix;
		} else {
			process.env.npm_config_prefix = previousLowercasePrefix;
		}
	}
});

test("resolvePiPaths includes the Promise.withResolvers polyfill path", () => {
	const paths = resolvePiPaths("/repo/sherlock-ai");

	assert.equal(paths.promisePolyfillPath, "/repo/sherlock-ai/dist/system/promise-polyfill.js");
});

test("toNodeImportSpecifier converts absolute preload paths to file URLs", () => {
	assert.equal(
		toNodeImportSpecifier("/repo/sherlock-ai/dist/system/promise-polyfill.js"),
		pathToFileURL("/repo/sherlock-ai/dist/system/promise-polyfill.js").href,
	);
	assert.equal(toNodeImportSpecifier("tsx"), "tsx");
});
