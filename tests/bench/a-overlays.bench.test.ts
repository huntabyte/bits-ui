import { describe, it } from "vitest";
import { bench, writeResults, assert, $ } from "./harness.js";
import { props } from "./props.svelte.js";
import TooltipTether from "./fixtures/a-tooltip-tether.svelte";

writeResults("a-overlays");

describe("tooltip-tether", () => {
	it("mount 500 tethered triggers", () =>
		bench("tooltip-tether/mount-500", {
			component: TooltipTether,
			props: props({ count: 500 }),
			verify: ({ target }) =>
				assert(target.querySelectorAll("[data-bench=trigger]").length === 500, "triggers"),
		}));
	it("open on trigger 250 of 500", () =>
		bench("tooltip-tether/open-250-of-500", {
			component: TooltipTether,
			props: props({ count: 500, triggerId: null as string | null }),
			run: ({ props }) => void (props.triggerId = "t250"),
			verify: () =>
				assert($(document, "[data-bench=content]")?.textContent === "tip 250", "payload"),
		}));
});
