import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { fireFocus, getTestKbd, setupUserEvents } from "../utils.js";
import ListboxTest, { type ListboxTestProps, defaultItems } from "./ListboxTest.svelte";

const kbd = getTestKbd();

function setup(props: Partial<ListboxTestProps> = {}) {
	const user = setupUserEvents();
	const returned = render(ListboxTest, { ...props });
	const label = returned.getByTestId("label");
	const content = returned.getByTestId("content");
	const group = returned.getByTestId("group");
	const groupLabel = returned.getByTestId("group-label");
	const value = returned.getByTestId("value");
	const binding = returned.getByTestId("binding");
	const items: HTMLElement[] = [];

	for (const item of defaultItems) [items.push(returned.getByTestId(`item-${item.value}`))];

	return {
		...returned,
		value,
		binding,
		user,
		label,
		content,
		group,
		groupLabel,
		items,
	};
}

describe("listbox - single", () => {
	it("has no accessibility violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { label, content, group, groupLabel, items } = setup();
		expect(label).toHaveAttribute("data-listbox-label");
		expect(content).toHaveAttribute("data-listbox-content");
		expect(group).toHaveAttribute("data-listbox-group");
		expect(groupLabel).toHaveAttribute("data-listbox-group-label");
		expect(items[0]).toHaveAttribute("data-listbox-item");
	});

	it("selects an item when clicked and deselects when clicked again", async () => {
		const { user, items, value } = setup();
		const item0 = items[0]!;

		await user.click(item0);
		expectIsSelected(item0);
		expect(item0).toHaveFocus();
		expect(value.textContent).toEqual(defaultItems[0]!.value);
		await user.click(item0);
		expectIsNotSelected(item0);
		expect(value.textContent).toEqual("");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"selects and deselects an item when focused with %s key",
		async (key) => {
			const { user, items, value } = setup();
			const item0 = items[0]!;

			await fireFocus(item0);
			item0.focus();
			await user.keyboard(key);
			expectIsSelected(item0);
			expect(item0).toHaveFocus();
			expect(value.textContent).toEqual(defaultItems[0]!.value);
			await user.keyboard(key);
			expectIsNotSelected(item0);
			expect(value.textContent).toEqual("");
		}
	);

	it("navigations through the list items using the arrow keys (vertical) (no loop)", async () => {
		const { user, items } = setup();

		await fireFocus(items[0]!);
		const totalItems = items.length;

		// moving down
		for (let i = 0; i < totalItems; i++) {
			if (i === 0) expectIsHighlighted(items[i]!);

			await user.keyboard(kbd.ARROW_DOWN);

			if (i < totalItems - 1) {
				expectIsNotHighlighted(items[i]!);
				expectIsHighlighted(items[i + 1]!);
			} else {
				// for the last item, it should remain highlighted
				expectIsHighlighted(items[i]!);
			}
		}

		// pressing down again on the last item
		await user.keyboard(kbd.ARROW_DOWN);
		expectIsHighlighted(items[totalItems - 1]!);

		// moving up
		for (let i = totalItems - 1; i > 0; i--) {
			await user.keyboard(kbd.ARROW_UP);
			expectIsNotHighlighted(items[i]!);
			expectIsHighlighted(items[i - 1]!);
		}
	});

	it("navigations through the list items using the arrow keys (vertical) (loop)", async () => {
		const { user, items } = setup({ loop: true });

		await fireFocus(items[0]!);
		const totalItems = items.length;
		// cycling through the items twice
		const iterations = 2;

		for (let cycle = 0; cycle < iterations; cycle++) {
			for (let i = 0; i < totalItems; i++) {
				if (i === 0 && cycle === 0) expectIsHighlighted(items[i]!);

				await user.keyboard(kbd.ARROW_DOWN);

				expectIsNotHighlighted(items[i]!);
				expectIsHighlighted(items[(i + 1) % totalItems]!);
			}
		}

		// check we've returned to the initial state
		expectIsHighlighted(items[0]!);
	});

	it("navigations through the list items using the arrow keys (horizontal) (no loop)", async () => {
		const { user, items } = setup({ orientation: "horizontal" });

		await fireFocus(items[0]!);

		const totalItems = items.length;

		for (let i = 0; i < totalItems; i++) {
			if (i === 0) expectIsHighlighted(items[i]!);

			await user.keyboard(kbd.ARROW_RIGHT);

			if (i < totalItems - 1) {
				expectIsNotHighlighted(items[i]!);
				expectIsHighlighted(items[i + 1]!);
			} else {
				// for the last item, it should remain highlighted
				expectIsHighlighted(items[i]!);
			}
		}

		// now go back
		for (let i = totalItems - 1; i > 0; i--) {
			await user.keyboard(kbd.ARROW_LEFT);
			expectIsNotHighlighted(items[i]!);
			expectIsHighlighted(items[i - 1]!);
		}
	});

	it("navigations through the list items using the arrow keys (horizontal) (loop)", async () => {
		const { user, items } = setup({ loop: true, orientation: "horizontal" });

		await fireFocus(items[0]!);
		const totalItems = items.length;
		// cycling through the items twice
		const iterations = 2;

		for (let cycle = 0; cycle < iterations; cycle++) {
			for (let i = 0; i < totalItems; i++) {
				if (i === 0 && cycle === 0) expectIsHighlighted(items[i]!);

				await user.keyboard(kbd.ARROW_RIGHT);

				expectIsNotHighlighted(items[i]!);
				expectIsHighlighted(items[(i + 1) % totalItems]!);
			}
		}

		// check we've returned to the initial state
		expectIsHighlighted(items[0]!);
	});

	it("focuses the first item when no items are selected", async () => {
		const { user, items } = setup();

		await user.keyboard(kbd.TAB);
		expect(items[0]!).toHaveFocus();
	});

	it("focuses the selected item when a selected item is present", async () => {
		const { user, items } = setup({
			value: defaultItems[1]!.value,
		});

		await user.keyboard(kbd.TAB);
		expect(items[1]!).toHaveFocus();
	});

	it("focuses the first item when the `HOME` key is pressed and focus is within the listbox", async () => {
		const { user, items } = setup();

		await fireFocus(items[2]!);
		expect(items[2]!).toHaveFocus();
		expect(items[0]!).not.toHaveFocus();
		await user.keyboard(kbd.HOME);
		expect(items[0]!).toHaveFocus();
	});

	it("focuses the last item when the `END` key is pressed and focus is within the listbox", async () => {
		const { user, items } = setup();

		await fireFocus(items[2]!);
		expect(items[2]!).toHaveFocus();
		await user.keyboard(kbd.END);
		expect(items[3]!).toHaveFocus();
	});
});

function expectIsHighlighted(item: HTMLElement) {
	expect(item).toHaveAttribute("data-highlighted");
}

function expectIsNotHighlighted(item: HTMLElement) {
	expect(item).not.toHaveAttribute("data-highlighted");
}

function expectIsSelected(item: HTMLElement) {
	expect(item).toHaveAttribute("data-selected");
	expect(item).toHaveAttribute("aria-selected", "true");
}
function expectIsNotSelected(item: HTMLElement) {
	expect(item).not.toHaveAttribute("data-selected");
	expect(item).not.toHaveAttribute("aria-selected", "true");
}
