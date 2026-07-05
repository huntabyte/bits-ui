import { scenarios } from "./scenarios/index.svelte";

declare global {
	interface Window {
		__scenario: (typeof scenarios)[string];
		__ready: boolean;
		__error: string | undefined;
	}
}

const name = new URLSearchParams(location.search).get("scenario");

async function init() {
	if (!name) {
		document.getElementById("app")!.textContent =
			`Pass ?scenario=<name>. Available: ${Object.keys(scenarios).join(", ")}`;
		return;
	}
	const scenario = scenarios[name];
	if (!scenario) throw new Error(`unknown scenario: ${name}`);
	window.__scenario = scenario;
	await scenario.setup(document.getElementById("app")!);
	window.__ready = true;
}

init().catch((e) => {
	window.__error = String(e);
	console.error(e);
});
