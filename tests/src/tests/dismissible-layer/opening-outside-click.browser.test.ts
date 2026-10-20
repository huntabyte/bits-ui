import { page } from "vitest/browser";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import DropdownMenuTest from "./opening-dropdown-menu-test.svelte";
import ComboboxTest from "../combobox/combobox-test.svelte";
import { expectNotExists, waitForDismissibleLayer } from "../browser-utils";

function outsideClick() {
	for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) {
		const EventType = type.startsWith("pointer") ? PointerEvent : MouseEvent;
		document.documentElement.dispatchEvent(
			new EventType(type, {
				bubbles: true,
				composed: true,
				cancelable: true,
				clientX: window.innerWidth - 1,
				clientY: 1,
				button: 0,
				buttons: type.endsWith("down") ? 1 : 0,
				pointerType: "mouse",
			})
		);
	}
}

// The previous close restores body `pointer-events` on a timer; until then a trigger
// click lands on <html> and nothing opens.
const waitForBodyPointerEvents = () =>
	expect.poll(() => document.body.style.pointerEvents).not.toBe("none");

describe("dismissible layer - opening outside click", () => {
	for (const component of ["DropdownMenu", "Combobox"] as const) {
		it(`${component} dismisses an outside click during opening and immediate reopen`, async () => {
			const onInteractOutside = vi.fn();
			const onSelect = vi.fn();
			const contentProps = { onInteractOutside };
			if (component === "DropdownMenu") {
				await render(DropdownMenuTest, { onInteractOutside, onSelect });
			} else {
				await render(ComboboxTest, {
					items: [{ value: "1", label: "One" }],
					contentProps,
				});
			}

			for (let attempt = 1; attempt <= 2; attempt++) {
				await waitForBodyPointerEvents();
				let clickedDuringOpening = false;
				// Dispatch in the first DOM-observer turn, before delayed registration can
				// run. DropdownMenu must still have Presence's public opening marker.
				const observer = new MutationObserver(() => {
					const selector =
						component === "DropdownMenu"
							? '[data-testid="content"][data-starting-style]'
							: '[data-testid="content"]';
					if (!document.querySelector(selector)) return;
					observer.disconnect();
					clickedDuringOpening = true;
					outsideClick();
				});
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true,
				});

				try {
					await page.getByTestId("trigger").click({ force: true });
					await expect
						.poll(() => clickedDuringOpening, { message: `opening attempt ${attempt}` })
						.toBe(true);
					await expect.poll(() => onInteractOutside.mock.calls.length).toBe(attempt);
					expect(onInteractOutside.mock.lastCall?.[0].target).toBe(
						document.documentElement
					);
					await expectNotExists(page.getByTestId("content"));
					expect(onSelect).not.toHaveBeenCalled();
					if (component === "Combobox") {
						await expect
							.element(page.getByTestId("value-binding"))
							.toHaveTextContent("empty");
					}
				} finally {
					observer.disconnect();
					// On a broken implementation, verify the identical sequence dismisses
					// later. This also leaves the next fixture free of an open modal layer.
					if (document.querySelector('[data-testid="content"]')) {
						await waitForDismissibleLayer(page.getByTestId("content"));
						outsideClick();
						await expectNotExists(page.getByTestId("content"));
					}
				}
			}
		});
	}

	// #2141: a native outside click sent right behind the opening click. Both clicks are
	// queued without awaiting, so the outside one lands as early as the browser allows.
	it("DropdownMenu dismisses a native outside click sent right after the opening click", async () => {
		const onInteractOutside = vi.fn();
		const onSelect = vi.fn();
		render(DropdownMenuTest, { onInteractOutside, onSelect });
		const trigger = page.getByTestId("trigger");
		const outside = page.elementLocator(document.documentElement);

		for (let attempt = 1; attempt <= 10; attempt++) {
			await waitForBodyPointerEvents();
			await Promise.all([
				trigger.click({ force: true }),
				outside.click({ force: true, position: { x: window.innerWidth - 1, y: 1 } }),
			]);
			await expect
				.poll(() => onInteractOutside.mock.calls.length, {
					message: `opening attempt ${attempt}`,
				})
				.toBe(attempt);
			await expectNotExists(page.getByTestId("content"));
		}
		expect(onSelect).not.toHaveBeenCalled();
	});
});
