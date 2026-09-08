import { page } from "@vitest/browser/context";
import { describe, it } from "vitest";
import { render } from "vitest-browser-svelte";
import ComboboxTest, { type Item } from "../combobox/combobox-test.svelte";
import { expectExists, expectNotExists, waitForDismissibleLayer } from "../browser-utils";

/**
 * An outside click must dismiss the layer no matter how soon after the layer registered
 * it happens.
 *
 * Regression guard for a stale timer scheduled by `DismissibleLayerState`'s watch cleanup:
 * it fired ~20ms into the layer's own lifetime and cleared the `isResponsibleLayer` flag
 * that the outside `pointerdown` had just set, in the window before the debounced
 * interact-outside handler ran. Clicks landing roughly 4-14ms after registration hit that
 * window, so the delay sweep below is what makes the bug reproducible instead of a ~1-in-100
 * CI flake.
 */

const items: Item[] = [
	{ value: "1", label: "A" },
	{ value: "2", label: "B" },
	{ value: "3", label: "C" },
	{ value: "4", label: "D" },
];

const DELAYS_MS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20];
const REPS = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("dismissible layer - outside click timing", () => {
	for (const delay of DELAYS_MS) {
		for (let rep = 0; rep < REPS; rep++) {
			it(`should close on an outside click ${delay}ms after the layer registers (rep ${rep})`, async () => {
				render(ComboboxTest, { name: "test", items });

				await page.getByTestId("trigger").click({ force: true });
				await expectExists(page.getByTestId("content"));
				await waitForDismissibleLayer(page.getByTestId("content"));

				await sleep(delay);

				await page.getByTestId("outside").click({ force: true });
				await expectNotExists(page.getByTestId("content"));
			});
		}
	}
});
