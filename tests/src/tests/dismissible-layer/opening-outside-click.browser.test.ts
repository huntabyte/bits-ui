import { page } from "@vitest/browser/context";
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

describe("dismissible layer - opening outside click", () => {
	for (const component of ["DropdownMenu", "Combobox"] as const) {
		it(`${component} dismisses an outside click during opening and immediate reopen`, async () => {
			const onInteractOutside = vi.fn();
			const onSelect = vi.fn();
			const contentProps = { onInteractOutside };
			if (component === "DropdownMenu") {
				render(DropdownMenuTest, { onInteractOutside, onSelect });
			} else {
				render(ComboboxTest, { items: [{ value: "1", label: "One" }], contentProps });
			}

			for (let attempt = 1; attempt <= 2; attempt++) {
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
});
