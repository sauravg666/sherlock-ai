import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const SHERLOCK_AI_SERVICE_TIERS = [
	"auto",
	"default",
	"flex",
	"priority",
	"standard_only",
] as const;

export type SherlockServiceTier = (typeof SHERLOCK_AI_SERVICE_TIERS)[number];

const SERVICE_TIER_SET = new Set<string>(SHERLOCK_AI_SERVICE_TIERS);
const OPENAI_SERVICE_TIERS = new Set<SherlockServiceTier>(["auto", "default", "flex", "priority"]);
const ANTHROPIC_SERVICE_TIERS = new Set<SherlockServiceTier>(["auto", "standard_only"]);

function readSettings(settingsPath: string): Record<string, unknown> {
	try {
		return JSON.parse(readFileSync(settingsPath, "utf8")) as Record<string, unknown>;
	} catch {
		return {};
	}
}

export function normalizeServiceTier(value: string | undefined): SherlockServiceTier | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase();
	return SERVICE_TIER_SET.has(normalized) ? (normalized as SherlockServiceTier) : undefined;
}

export function getConfiguredServiceTier(settingsPath: string): SherlockServiceTier | undefined {
	const settings = readSettings(settingsPath);
	return normalizeServiceTier(typeof settings.serviceTier === "string" ? settings.serviceTier : undefined);
}

export function setConfiguredServiceTier(settingsPath: string, tier: SherlockServiceTier | undefined): void {
	const settings = readSettings(settingsPath);
	if (tier) {
		settings.serviceTier = tier;
	} else {
		delete settings.serviceTier;
	}

	mkdirSync(dirname(settingsPath), { recursive: true });
	writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n", "utf8");
}

export function resolveActiveServiceTier(settingsPath: string): SherlockServiceTier | undefined {
	return normalizeServiceTier(process.env.SHERLOCK_AI_SERVICE_TIER) ?? getConfiguredServiceTier(settingsPath);
}

export function resolveProviderServiceTier(
	provider: string | undefined,
	tier: SherlockServiceTier | undefined,
): SherlockServiceTier | undefined {
	if (!provider || !tier) return undefined;
	if ((provider === "openai" || provider === "openai-codex") && OPENAI_SERVICE_TIERS.has(tier)) {
		return tier;
	}
	if (provider === "anthropic" && ANTHROPIC_SERVICE_TIERS.has(tier)) {
		return tier;
	}
	return undefined;
}
