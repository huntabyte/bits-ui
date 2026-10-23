import { expect, it, vi, describe, beforeEach } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestId } from "../helpers/select.js";
import { getTestKbd } from "../utils.js";
import type { SelectForceMountTestProps } from "./select-force-mount-test.svelte";
import SelectForceMountTest from "./select-force-mount-test.svelte";
import type { SelectMultipleTestProps } from "./select-multi-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import type { Item, SelectSingleTestProps } from "./select-test.svelte";
import SelectTest from "./select-test.svelte";
import type { SelectValueChildTestProps } from "./select-value-child-test.svelte";
import SelectValueChildTest from "./select-value-child-test.svelte";
import type { SelectValueChildrenMultiTestProps } from "./select-value-children-multi-test.svelte";
import SelectValueChildrenMultiTest from "./select-value-children-multi-test.svelte";
import SelectValueLabelPersistTest from "./select-value-label-persist-test.svelte";
import SelectValueLabelPersistSingleTest from "./select-value-label-persist-single-test.svelte";
import SelectViewportTest from "./select-viewport-test.svelte";
import {
	expectExists,
	expectNotExists,
	observeTransitionAttrs,
	waitForDismissibleLayer,
} from "../browser-utils";
import SelectScrollJumpTest from "./select-scroll-jump-test.svelte";
import SelectScrollButtonsTest from "./select-scroll-buttons-test.svelte";
import SelectFieldsetDisabledTest from "./select-fieldset-disabled-test.svelte";
import SelectSettlingContentTest from "./select-settling-content-test.svelte";
import SelectChildTriggerTest from "./select-child-trigger-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "",
		label: "None",
	},
	{
		value: "1",
		label: "A",
	},
	{
		value: "2",
		label: "B",
	},
	{
		value: "3",
		label: "C",
	},
	{
		value: "4",
		label: "D",
	},
];

function setupSingle(
	props: Partial<SelectSingleTestProps | SelectForceMountTestProps> = {},
	items: Item[] = testItems,
	// oxlint-disable-next-line no-explicit-any
	component: Component<any, any, any> = SelectTest
) {
	const returned = render(component, { name: "test", ...props, items });
	const trigger = page.getByTestId("trigger");
	const openBinding = page.getByTestId("open-binding");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");

	function getContent() {
		return page.getByTestId("content");
	}

	function getHiddenInput(name = "test") {
		return returned.container.querySelector(`input[name="${name}"]`);
	}

	return {
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
	};
}

function setupMultiple(props: Partial<SelectMultipleTestProps> = {}, items: Item[] = testItems) {
	// @ts-expect-error - this is fine
	const returned = render(SelectMultiTest, { name: "test", ...props, items });
	const trigger = page.getByTestId("trigger");
	const openBinding = page.getByTestId("open-binding");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");
	const submit = page.getByTestId("submit");

	function getHiddenInputs(name = "test") {
		return Array.from(
			returned.container.querySelectorAll<HTMLElement>(`input[name="${name}"]`)
		);
	}

	function getContent() {
		return page.getByTestId("content");
	}

	return {
		trigger,
		openBinding,
		valueBinding,
		outside,
		submit,
		getHiddenInputs,
		getContent,
	};
}

function setupValueChildSingle(
	props: Partial<SelectValueChildTestProps> = {},
	items: Item[] = testItems
) {
	const returned = render(SelectValueChildTest, { ...props, items });
	const trigger = page.getByTestId("trigger");
	const valueNode = page.getByTestId("value-node");
	const selectionType = page.getByTestId("selection-type");
	const selectionValue = page.getByTestId("selection-value");
	const selectionLabel = page.getByTestId("selection-label");
	const selectionDisabled = page.getByTestId("selection-disabled");
	const setValueButton = page.getByTestId("set-value-2");

	function getContent() {
		return page.getByTestId("content");
	}

	function getHiddenInput(name = "theme") {
		return returned.container.querySelector(`input[name="${name}"]`);
	}

	return {
		trigger,
		valueNode,
		selectionType,
		selectionValue,
		selectionLabel,
		selectionDisabled,
		setValueButton,
		getContent,
		getHiddenInput,
	};
}

function setupValueChildrenMultiple(
	props: Partial<SelectValueChildrenMultiTestProps> = {},
	items: Item[] = testItems
) {
	const returned = render(SelectValueChildrenMultiTest, { ...props, items });
	const trigger = page.getByTestId("trigger");
	const selectionType = page.getByTestId("selection-type");
	const selectionValues = page.getByTestId("selection-values");
	const selectionLabel = page.getByTestId("selection-label");
	const selectionDisabled = page.getByTestId("selection-disabled");
	const setValuesButton = page.getByTestId("set-values-1-3");

	function getContent() {
		return page.getByTestId("content");
	}

	function getHiddenInputs(name = "themes") {
		return Array.from(
			returned.container.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)
		);
	}

	return {
		trigger,
		selectionType,
		selectionValues,
		selectionLabel,
		selectionDisabled,
		setValuesButton,
		getContent,
		getHiddenInputs,
	};
}

async function openSingle(
	props: Partial<SelectSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const t = setupSingle(props);

	await expectNotExists(t.getContent());

	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	await waitForDismissibleLayer(t.getContent());
	const content = t.getContent();
	const group = page.getByTestId("group");
	const groupHeading = page.getByTestId("group-label");

	return {
		...t,
		group,
		groupHeading,
		content,
	};
}

async function openMultiple(
	props: Partial<SelectMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const t = setupMultiple(props);
	await expectNotExists(t.getContent());
	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	await waitForDismissibleLayer(t.getContent());
	const content = t.getContent();
	return {
		...t,
		content,
	};
}

function nextFrame() {
	return new Promise<void>((resolve) => {
		window.requestAnimationFrame(() => resolve());
	});
}

function sleep(ms: number) {
	return new Promise<void>((resolve) => {
		window.setTimeout(() => resolve(), ms);
	});
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("select - single", () => {
	it("should open on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("should apply custom style prop to content", async () => {
		const t = await openSingle({
			contentProps: {
				style: { backgroundColor: "rgb(255, 0, 0)" },
			},
		});
		const contentEl = t.getContent().element() as HTMLElement;
		expect(contentEl.style.backgroundColor).toBe("rgb(255, 0, 0)");
	});

	it("should apply transition attrs to content during open and close", async () => {
		const t = setupSingle({}, testItems, SelectForceMountTest);
		const observer = observeTransitionAttrs(t.getContent().element());

		await t.trigger.click();
		await vi.waitFor(() => expect(observer.history.some((entry) => entry.starting)).toBe(true));
		await waitForDismissibleLayer(t.getContent());

		await t.outside.click({ force: true });
		await vi.waitFor(() => expect(observer.history.some((entry) => entry.ending)).toBe(true));

		observer.disconnect();
	});

	it("should apply the appropriate `aria-labelledby` attribute to the group", async () => {
		const t = await openSingle();

		await expect
			.element(t.group)
			.toHaveAttribute("aria-labelledby", t.groupHeading.element().id);
	});

	it("should expose the trigger as a combobox controlling the mounted listbox", async () => {
		const t = setupSingle({ contentProps: { id: "select-listbox" } });
		await expectTriggerControlsListbox(t.trigger, "select-listbox");
	});

	it("should select item with the enter key", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setupSingle();
		await expect.element(t.getHiddenInput()).toBeInTheDocument();
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const t = setupSingle({ name: "" });
		await expect.element(t.getHiddenInput()).not.toBeInTheDocument();
	});

	it("should sync the value prop to the hidden input", async () => {
		const t = setupSingle({ value: "test" });
		await expect.element(t.getHiddenInput()).toHaveValue("test");
	});

	it("should sync the required prop to the hidden input", async () => {
		const t = setupSingle({ required: true });
		await expect.element(t.getHiddenInput()).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden input", async () => {
		const t = setupSingle({ disabled: true });
		await expect.element(t.getHiddenInput()).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const t = await openSingle();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openSingle();

		await t.outside.click({ force: true });
		await expectNotExists(t.getContent());
	});

	it("should portal to the body by default", async () => {
		const t = await openSingle();
		expect(t.content.element().parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openSingle({ portalProps: { disabled: true } });
		const main = page.getByTestId("main").element() as HTMLElement;
		expect(t.content.element().parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openSingle();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await userEvent.keyboard(kbd.ESCAPE);
		await expect.element(t.openBinding).toHaveTextContent("false");
		await expectNotExists(t.getContent());
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.getContent());
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		await expect.element(t.valueBinding).toHaveTextContent("1");
		await userEvent.keyboard(kbd.ESCAPE);
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const [_, item1] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item1.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.getHiddenInput()).toHaveValue("1");
		await t.trigger.click();
		await expectSelected(item1);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should expose `aria-selected` on all items", async () => {
		const t = await openSingle();
		const items = getItems(page.getByTestId);
		// the select's value defaults to "", so the empty-value item is selected
		await expectSelected(items[0]);
		await expectNotSelected(items.slice(1));
		await items[1].click();
		await t.trigger.click();
		await expectNotSelected([items[0], ...items.slice(2)]);
		await expectSelected(items[1]);
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openSingle({
			loop: true,
		});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectNotHighlighted(item4);
		await expectHighlighted(item0);

		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		await expect.element(t.getHiddenInput()).toHaveValue("4");
		await t.trigger.click();
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should select first item with empty string value when pressing Enter", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER); // first item ("")
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value after navigating through items", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ARROW_UP); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value in loop navigation", async () => {
		const t = await openSingle({ loop: true });
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "2"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "3"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "4"
		await userEvent.keyboard(kbd.ARROW_DOWN); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should revert to empty state when deselecting a value", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		// First select a non-empty value
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).not.toHaveTextContent("empty");

		// Then deselect by selecting empty value
		await t.trigger.click();
		await userEvent.keyboard(kbd.ARROW_UP); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should maintain empty value after reopening", async () => {
		const t = await openSingle();
		// Select empty value
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");

		// Close and reopen
		await userEvent.keyboard(kbd.ESCAPE);
		await t.trigger.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openSingle({});
		const [item1, item2] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await expectNotHighlighted(item2);
	});

	it("should select a default item when provided", async () => {
		const t = await openSingle({
			value: "2",
		});
		await expect.element(page.getByTestId("2-indicator")).toBeInTheDocument();
		await expect.element(t.trigger).toHaveTextContent("B");
		await expect.element(t.getHiddenInput()).toHaveValue("2");
		const [_, __, item2] = getItems(page.getByTestId);
		await expectSelected(item2);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
		await expect.element(t.trigger).toHaveFocus();

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getContent());
		const [i0, i1] = getItems(page.getByTestId);
		await expectHighlighted(i0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(i1);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		setupSingle({}, [], SelectForceMountTest);

		const content = page.getByTestId("content");
		await expect.element(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], SelectForceMountTest);

		await expectNotExists(page.getByTestId("content"));

		await t.trigger.click();

		await expectExists(page.getByTestId("content"));
	});

	it("should not deselect the selected item when the user clicks on the selected item", async () => {
		const t = await openSingle();

		const [item0] = getItems(page.getByTestId);
		await item0.click();
		await t.trigger.click();
		await expectSelected(item0);

		const [item0v2] = getItems(page.getByTestId);
		await item0v2.click();
		await t.trigger.click();
		await expectSelected(item0v2);

		const [item0v3] = getItems(page.getByTestId);
		await expectSelected(item0v3);
	});

	it("should allow deselecting an item when `allowDeselect` is true", async () => {
		const t = await openSingle({
			allowDeselect: true,
		});
		const [_, item1] = getItems(page.getByTestId);
		await item1.click({ force: true });
		await expectNotExists(t.getContent());
		await t.trigger.click();
		await expectSelected(item1);

		await item1.click();
		await expectExists(t.getContent());
		await expectNotSelected(item1);
	});

	it("should forward the `autocomplete` prop to the hidden input", async () => {
		const t = await openSingle({
			autocomplete: "one-time-code",
		});
		await expect.element(t.getHiddenInput()).toHaveAttribute("autocomplete", "one-time-code");
	});

	it("should update the value when the hidden input is autofilled", async () => {
		const t = setupSingle();
		const input = t.getHiddenInput() as HTMLInputElement;
		input.value = "2";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		await expect.element(t.valueBinding).toHaveTextContent("2");
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.element().dispatchEvent(touchEvent);

		await expectNotExists(page.getByTestId("content"));
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate mouse pointerdown event
		const mouseEvent = new PointerEvent("pointerdown", {
			pointerType: "mouse",
		});
		t.trigger.element().dispatchEvent(mouseEvent);

		await expectNotExists(page.getByTestId("content"));
	});

	it("should highlight the first item when Select.Viewport has no padding", async () => {
		const t = setupSingle({}, testItems, SelectViewportTest);

		await expectNotExists(t.getContent());
		await t.trigger.click();
		await expectExists(t.getContent());

		await expectHighlighted(page.getByTestId("empty"));
		await expectNotHighlighted(page.getByTestId("1"));
	});

	it("should not scroll the page when opening on trigger click", async () => {
		render(SelectScrollJumpTest);

		window.scrollTo(0, 640);
		for (let i = 0; i < 3; i++) {
			await nextFrame();
		}

		const baselineY = window.scrollY;
		let maxDrift = 0;
		const handleScroll = () => {
			maxDrift = Math.max(maxDrift, Math.abs(window.scrollY - baselineY));
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		for (let i = 0; i < 30; i++) {
			await nextFrame();
			handleScroll();
		}

		window.removeEventListener("scroll", handleScroll);

		expect(maxDrift).toBeLessThanOrEqual(1);
		expect(Math.abs(window.scrollY - baselineY)).toBeLessThanOrEqual(1);
	});

	it("should keep the user's scroll position when the scroll down button remounts", async () => {
		render(SelectScrollButtonsTest, { overlayScrollButtons: true });

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		const viewport = page.getByTestId("viewport").element() as HTMLElement;

		// let the content finish positioning and settle onto the highlighted item
		await sleep(100);

		// at the bottom of the list the scroll down button unmounts
		viewport.scrollTop = viewport.scrollHeight;
		await expectNotExists(page.getByTestId("scroll-down-button"));

		const bottom = viewport.scrollTop;
		expect(bottom).toBeGreaterThan(0);

		// scrolling back up by a few pixels remounts the button, whose mount effect
		// used to realign the viewport onto the highlighted item, which here is the
		// first item at the very top of the list
		viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: -5, bubbles: true }));
		viewport.scrollTop = bottom - 5;
		await expectExists(page.getByTestId("scroll-down-button"));

		await sleep(100);

		expect(viewport.scrollTop).toBeGreaterThanOrEqual(bottom - 20);
	});

	it("should still scroll the selected item into view when opening", async () => {
		render(SelectScrollButtonsTest, { value: "55" });

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		const viewport = page.getByTestId("viewport").element() as HTMLElement;
		const selected = page.getByTestId("item-55").element() as HTMLElement;

		await sleep(100);

		const viewportRect = viewport.getBoundingClientRect();
		const selectedRect = selected.getBoundingClientRect();

		expect(selectedRect.top).toBeGreaterThanOrEqual(viewportRect.top);
		expect(selectedRect.bottom).toBeLessThanOrEqual(viewportRect.bottom);
	});

	it.each([
		{ button: "scroll-down-button", value: "", forceMount: false },
		{ button: "scroll-up-button", value: "50", forceMount: false },
		{ button: "scroll-down-button", value: "", forceMount: true },
		{ button: "scroll-up-button", value: "50", forceMount: true },
	])(
		"should stop auto scrolling when closed while hovering the $button (forceMount: $forceMount)",
		async ({ button, value, forceMount }) => {
			render(SelectScrollButtonsTest, { value, forceMount });

			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await sleep(100);

			// hover the button until the list starts auto scrolling, then close without
			// the pointer ever leaving it
			page.getByTestId(button)
				.element()
				.dispatchEvent(new PointerEvent("pointermove", { bubbles: true }));
			await sleep(120);
			await userEvent.keyboard(kbd.ESCAPE);
			// force mounted content stays in the DOM, so its buttons are never destroyed
			await expect
				.element(page.getByTestId("trigger"))
				.toHaveAttribute("data-state", "closed");

			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await sleep(100);

			const viewport = page.getByTestId("viewport").element() as HTMLElement;
			const scrollTop = viewport.scrollTop;
			await sleep(300);
			expect(viewport.scrollTop).toBe(scrollTop);
		}
	);

	it("should keep a typeahead-highlighted item clear of the scroll down button after the user has scrolled", async () => {
		render(SelectScrollButtonsTest);

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		const viewport = page.getByTestId("viewport").element() as HTMLElement;
		await sleep(100);

		// wheel down and back up, leaving the scroll up button unmounted
		viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: 40, bubbles: true }));
		viewport.scrollTop = 40;
		await expectExists(page.getByTestId("scroll-up-button"));
		viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: -40, bubbles: true }));
		viewport.scrollTop = 0;
		await expectNotExists(page.getByTestId("scroll-up-button"));

		// highlighting far down mounts the scroll up button, which shrinks the viewport
		// under the item that was just scrolled into view
		await userEvent.keyboard("Item 30");
		await expectHighlighted(page.getByTestId("item-30"));
		await expectExists(page.getByTestId("scroll-up-button"));
		await sleep(100);

		const item = page.getByTestId("item-30").element() as HTMLElement;
		const downButton = page.getByTestId("scroll-down-button").element() as HTMLElement;
		const viewportRect = viewport.getBoundingClientRect();
		const itemRect = item.getBoundingClientRect();

		expect(itemRect.top).toBeGreaterThanOrEqual(viewportRect.top - 1);
		expect(itemRect.bottom).toBeLessThanOrEqual(viewportRect.bottom + 1);
		expect(itemRect.bottom).toBeLessThanOrEqual(downButton.getBoundingClientRect().top + 1);
	});

	describe("mouse press on an item", () => {
		async function pressItem(testId: string) {
			render(SelectScrollButtonsTest);
			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await sleep(100);
			const rect = page.getByTestId(testId).element().getBoundingClientRect();
			const point = {
				clientX: rect.left + rect.width / 2,
				clientY: rect.top + rect.height / 2,
			};
			page.getByTestId(testId).element().dispatchEvent(mousePointer("pointerdown", point));
			return point;
		}

		function mousePointer(type: string, point: { clientX: number; clientY: number }) {
			return new PointerEvent(type, {
				...point,
				bubbles: true,
				cancelable: true,
				pointerType: "mouse",
				isPrimary: true,
				button: 0,
			});
		}

		function itemAt({ clientX, clientY }: { clientX: number; clientY: number }) {
			return document
				.elementFromPoint(clientX, clientY)!
				.closest<HTMLElement>("[role=option]")!;
		}

		it("should select the pressed item when the list scrolls under a still pointer", async () => {
			const point = await pressItem("item-3");
			const viewport = page.getByTestId("viewport").element() as HTMLElement;
			viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: 60, bubbles: true }));
			viewport.scrollTop = 60;
			await expectExists(page.getByTestId("scroll-up-button"));
			await sleep(100);

			const released = itemAt(point);
			expect(released.dataset.testid).not.toBe("item-3");
			released.dispatchEvent(mousePointer("pointerup", point));
			await expect.element(page.getByTestId("trigger")).toHaveTextContent(/^3$/);
		});

		it("should select the item the pointer was moved to before release", async () => {
			const from = await pressItem("item-1");
			const rect = page.getByTestId("item-2").element().getBoundingClientRect();
			const to = { clientX: from.clientX, clientY: rect.top + rect.height / 2 };
			itemAt(to).dispatchEvent(mousePointer("pointerup", to));
			await expect.element(page.getByTestId("trigger")).toHaveTextContent(/^2$/);
		});

		it("should not reuse a press that was released off an item", async () => {
			// press item-3, release off any item: that press is over
			const point = await pressItem("item-3");
			const content = page.getByTestId("content").element() as HTMLElement;
			content.dispatchEvent(mousePointer("pointerup", point));
			const viewport = page.getByTestId("viewport").element() as HTMLElement;
			viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: 60, bubbles: true }));
			viewport.scrollTop = 60;
			await expectExists(page.getByTestId("scroll-up-button"));
			await sleep(100);
			// a new press that starts off any item and is released on one at the same point
			content.dispatchEvent(mousePointer("pointerdown", point));
			const released = itemAt(point);
			expect(released.dataset.testid).not.toBe("item-3");
			released.dispatchEvent(mousePointer("pointerup", point));
			await expect
				.element(page.getByTestId("trigger"))
				.toHaveTextContent(released.dataset.testid!.replace("item-", ""));
		});
	});

	it("should highlight the selected item on reopen when its value is an empty string", async () => {
		const items: Item[] = [
			{ value: "1", label: "A" },
			{ value: "2", label: "B" },
			{ value: "", label: "All" },
		];
		const t = setupSingle({ value: "1" }, items);
		(t.trigger.element() as HTMLElement).focus();

		await userEvent.keyboard(kbd.ENTER);
		await expectHighlighted(page.getByTestId("1"));
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(page.getByTestId("empty"));
		await userEvent.keyboard(kbd.ENTER);
		await expectNotExists(t.getContent());

		await userEvent.keyboard(kbd.ENTER);
		await expectExists(t.getContent());
		await expectSelected(page.getByTestId("empty"));
		await expectHighlighted(page.getByTestId("empty"));
		await expectNotHighlighted(page.getByTestId("1"));
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("select - multiple", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should expose the trigger as a combobox controlling the mounted listbox", async () => {
		const t = setupMultiple({ contentProps: { id: "select-listbox" } });
		await expectTriggerControlsListbox(t.trigger, "select-listbox");
	});

	it("should select item with the enter key", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		mockFn.mockClear();
		await userEvent.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		(t.trigger.element() as HTMLElement).focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await userEvent.keyboard(kbd.ARROW_DOWN);
		mockFn.mockClear();
		await userEvent.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render a hidden input for each value in the `value` array, each with the same `name` prop", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		await expect.element(hiddenInputs[0]).toHaveAttribute("name", "test");
		await expect.element(hiddenInputs[1]).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden inputs", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		await expect.element(hiddenInputs[0]).toHaveValue("a");
		await expect.element(hiddenInputs[1]).toHaveValue("b");
	});

	it("should keep the hidden inputs in sync with the value after a form reset", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const form = page.getByTestId("form").element() as HTMLFormElement;
		form.reset();
		await new Promise((r) => requestAnimationFrame(r));

		expect(new FormData(form).getAll("test")).toEqual(["a", "b"]);
		const hiddenInputs = t.getHiddenInputs();
		await expect.element(hiddenInputs[0]).toHaveValue("a");
		await expect.element(hiddenInputs[1]).toHaveValue("b");
	});

	it("should sync the required prop to the hidden inputs", async () => {
		const t = setupMultiple({ required: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			await expect.element(hiddenInput).toHaveAttribute("required");
		}
	});

	it("should sync the disabled prop to the hidden inputs", async () => {
		const t = setupMultiple({ disabled: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			await expect.element(hiddenInput).toHaveAttribute("disabled");
		}
	});

	it("should close on escape keydown", async () => {
		const t = await openMultiple();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openMultiple();
		await t.outside.click({ force: true });
		await expectNotExists(t.getContent());
	});

	it("should portal to the body by default", async () => {
		const t = await openMultiple();
		expect(t.content.element().parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openMultiple({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = page.getByTestId("portal-target").element();
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openMultiple({ portalProps: { disabled: true } });
		const form = page.getByTestId("form").element();
		expect(t.content.element().parentElement?.parentElement).toBe(form);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openMultiple();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("false");
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.getContent());
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent("1,2");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [_, item] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		expect(t.getHiddenInputs()).toHaveLength(1);
		await expect.element(t.getHiddenInputs()[0]).toHaveValue("1");

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openSingle({
			loop: true,
		});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expect.element(hiddenInputs[0]).toHaveValue("4");
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ENTER);
		await expectSelected([item4, item3]);
		await expectNotSelected([item0, item1, item2]);
	});

	it("should toggle a highlighted item with a single space keypress", async () => {
		const t = await openMultiple({}, kbd.SPACE);
		const [item0, item1] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);

		await userEvent.keyboard(kbd.SPACE);
		await expect.element(t.trigger).toHaveTextContent("A");
		await expectSelected(item1);

		await userEvent.keyboard(kbd.SPACE);
		await expect.element(t.trigger).toHaveTextContent("Open combobox");
		await expectNotSelected(item1);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openMultiple({});
		const [item1, item2] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should select a default item when provided", async () => {
		const t = await openMultiple({
			value: ["2"],
		});
		await expect.element(page.getByTestId("2-indicator")).not.toBeNull();
		await expect.element(t.trigger).toHaveTextContent("B");

		await expect.element(t.getHiddenInputs()[0]).toHaveValue("2");
		const [_, __, item2] = getItems(page.getByTestId);
		await expectSelected(item2);
	});

	it("should submit an array with a single empty string when the user submits the form without selecting any items", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd: FormData) => {
				submittedValues = fd.getAll("themes") as string[];
			},
			name: "themes",
		});

		await t.submit.click();
		expect(submittedValues).toHaveLength(1);
		expect(submittedValues![0]).toBe("");
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.element().dispatchEvent(touchEvent);

		await expectNotExists(t.getContent());
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupMultiple({ disabled: true });

		await t.trigger.click({ force: true });

		await expectNotExists(t.getContent());
	});

	it("should not submit an array with a single empty string when the `name` prop is passed but no items are selected", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd: FormData) => {
				submittedValues = fd.getAll("themes") as string[];
			},
		});
		await t.submit.click();
		expect(submittedValues).toHaveLength(0);
	});

	it("should highlight the selected item on open when its value is an empty string", async () => {
		const t = setupMultiple({ value: [""] }, [
			{ value: "1", label: "A" },
			{ value: "", label: "All" },
		]);
		(t.trigger.element() as HTMLElement).focus();

		await userEvent.keyboard(kbd.ENTER);
		await expectExists(t.getContent());
		await expectHighlighted(page.getByTestId("empty"));
		await expectNotHighlighted(page.getByTestId("1"));
	});
});

describe("select - value", () => {
	it("should expose child snippet props in single mode and update when setValue is called", async () => {
		const t = setupValueChildSingle({ name: "theme", placeholder: "Pick a theme" });

		await expect.element(t.selectionType).toHaveTextContent("single");
		await expect.element(t.selectionValue).toHaveTextContent("none");
		await expect.element(t.selectionLabel).toHaveTextContent("Pick a theme");
		await expect.element(t.selectionDisabled).toHaveTextContent("false");
		await expect.element(t.valueNode).toHaveAttribute("data-select-value");
		await expect.element(t.valueNode).toHaveAttribute("data-placeholder");

		await t.setValueButton.click();

		await expect.element(t.selectionValue).toHaveTextContent("2");
		await expect.element(t.selectionLabel).toHaveTextContent("B");
		await expect.element(t.valueNode).not.toHaveAttribute("data-placeholder");

		const hiddenInput = t.getHiddenInput();
		expect(hiddenInput).not.toBeNull();
		await expect.element(hiddenInput!).toHaveValue("2");

		await t.trigger.click();
		await expectExists(t.getContent());
		await expectSelected(page.getByTestId("2"));
	});

	it("should expose children snippet props in multiple mode and update when setValue is called", async () => {
		const t = setupValueChildrenMultiple({ name: "themes", placeholder: "Pick themes" });

		await expect.element(t.selectionType).toHaveTextContent("multiple");
		await expect.element(t.selectionValues).toHaveTextContent("none");
		await expect.element(t.selectionLabel).toHaveTextContent("Pick themes");
		await expect.element(t.selectionDisabled).toHaveTextContent("false");

		await t.setValuesButton.click();

		await expect.element(t.selectionValues).toHaveTextContent("1,3");
		await expect.element(t.selectionLabel).toHaveTextContent("A, C");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		await expect.element(hiddenInputs[0]).toHaveValue("1");
		await expect.element(hiddenInputs[1]).toHaveValue("3");

		await t.trigger.click();
		await expectExists(t.getContent());
		await expectSelected([page.getByTestId("1"), page.getByTestId("3")]);
	});

	it("should keep selection labels after the menu closes in multiple mode", async () => {
		render(SelectValueLabelPersistTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValues = page.getByTestId("selection-values");
		const item1 = page.getByTestId("1");
		const item2 = page.getByTestId("2");

		await trigger.click();
		await expectExists(page.getByTestId("content"));
		await item1.click();
		await expect.element(selectionValues).toHaveTextContent("1");
		await expect.element(selectionLabel).toHaveTextContent("A");
		await item2.click();
		await expect.element(selectionValues).toHaveTextContent("1,2");
		await expect.element(selectionLabel).toHaveTextContent("A, B");

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
		await expect.element(selectionLabel).toHaveTextContent("A, B");
	});

	it("should resolve labels for values set programmatically while open in multiple mode", async () => {
		render(SelectValueLabelPersistTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValues = page.getByTestId("selection-values");
		const setValues2 = page.getByTestId("set-values-2");

		await trigger.click();
		await expectExists(page.getByTestId("content"));
		await setValues2.click();

		await expect.element(selectionValues).toHaveTextContent("2");
		await expect.element(selectionLabel).toHaveTextContent("B");
		await expectExists(page.getByTestId("content"));
	});

	it("should update cached labels while a selected item label changes", async () => {
		render(SelectValueLabelPersistTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const item1 = page.getByTestId("1");
		const updateLabel = page.getByTestId("update-label-1");

		await trigger.click();
		await item1.click();
		await expect.element(selectionLabel).toHaveTextContent("A");

		await updateLabel.click();
		await expect.element(item1).toHaveTextContent("A updated");
		await expect.element(selectionLabel).toHaveTextContent("A updated");
	});

	it("should fall back to item text when selected item label is empty", async () => {
		render(SelectValueLabelPersistTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValues = page.getByTestId("selection-values");
		const emptyLabelItem = page.getByTestId("empty-label");

		await trigger.click();
		await emptyLabelItem.click();

		await expect.element(selectionValues).toHaveTextContent("empty-label");
		await expect.element(selectionLabel).toHaveTextContent("Visible fallback");

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
		await expect.element(selectionLabel).toHaveTextContent("Visible fallback");
	});

	it("should prune cached labels when multiple values are replaced", async () => {
		render(SelectValueLabelPersistTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValues = page.getByTestId("selection-values");
		const item1 = page.getByTestId("1");
		const item2 = page.getByTestId("2");
		const setValues1 = page.getByTestId("set-values-1");
		const setValues2 = page.getByTestId("set-values-2");
		const updateLabel = page.getByTestId("update-label-1");

		await trigger.click();
		await item1.click();
		await item2.click();
		await expect.element(selectionValues).toHaveTextContent("1,2");
		await expect.element(selectionLabel).toHaveTextContent("A, B");

		await setValues2.click();
		await expect.element(selectionValues).toHaveTextContent("2");
		await expect.element(selectionLabel).toHaveTextContent("B");

		await updateLabel.click();
		await setValues1.click();
		await expect.element(selectionValues).toHaveTextContent("1");
		await expect.element(selectionLabel).toHaveTextContent("A updated");
	});

	it("should keep selection labels after the menu closes in single mode", async () => {
		render(SelectValueLabelPersistSingleTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValue = page.getByTestId("selection-value");
		const item1 = page.getByTestId("1");

		await trigger.click();
		await expectExists(page.getByTestId("content"));
		await item1.click();

		await expectNotExists(page.getByTestId("content"));
		await expect.element(selectionValue).toHaveTextContent("1");
		await expect.element(selectionLabel).toHaveTextContent("A");
	});

	it("should resolve labels for values set programmatically while open in single mode", async () => {
		render(SelectValueLabelPersistSingleTest);
		const trigger = page.getByTestId("trigger");
		const selectionLabel = page.getByTestId("selection-label");
		const selectionValue = page.getByTestId("selection-value");
		const setValue2 = page.getByTestId("set-value-2");

		await trigger.click();
		await expectExists(page.getByTestId("content"));
		await setValue2.click();

		await expect.element(selectionValue).toHaveTextContent("2");
		await expect.element(selectionLabel).toHaveTextContent("B");
		await expectExists(page.getByTestId("content"));
	});

	it("should resolve labels from force-mounted items without opening", async () => {
		render(SelectValueLabelPersistSingleTest, { value: "2", forceMount: true });
		await expect.element(page.getByTestId("selection-label")).toHaveTextContent("B");
	});

	it("should pass disabled state to value snippets so consumers can block setValue", async () => {
		const t = setupValueChildSingle({
			name: "theme",
			placeholder: "Pick a theme",
			disabled: true,
		});

		await expect.element(t.selectionDisabled).toHaveTextContent("true");
		await t.setValueButton.click();
		await expect.element(t.selectionValue).toHaveTextContent("none");
		await expect.element(t.selectionLabel).toHaveTextContent("Pick a theme");

		const hiddenInput = t.getHiddenInput();
		expect(hiddenInput).not.toBeNull();
		await expect.element(hiddenInput!).toHaveValue("");
	});
});

function getItems(getter: typeof page.getByTestId, items = testItems) {
	const itemsArr: ReturnType<typeof page.getByTestId>[] = [];
	for (const item of items) {
		itemsArr.push(getter(getTestId(item)));
	}
	return itemsArr;
}

////////////////////////////////////
// HELPERS
////////////////////////////////////

type MaybeArray<T> = T | T[];
async function expectSelected(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).toHaveAttribute("data-selected");
			await expect.element(n).toHaveAttribute("aria-selected", "true");
		}
	} else {
		await expect.element(node).toHaveAttribute("data-selected");
		await expect.element(node).toHaveAttribute("aria-selected", "true");
	}
}

async function expectNotSelected(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).not.toHaveAttribute("data-selected");
			await expect.element(n).toHaveAttribute("aria-selected", "false");
		}
	} else {
		await expect.element(node).not.toHaveAttribute("data-selected");
		await expect.element(node).toHaveAttribute("aria-selected", "false");
	}
}

async function expectHighlighted(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).toHaveAttribute("data-highlighted");
		}
	} else {
		await expect.element(node).toHaveAttribute("data-highlighted");
	}
}

async function expectTriggerControlsListbox(
	trigger: ReturnType<typeof page.getByTestId>,
	listboxId: string
) {
	await expect.element(trigger).toHaveRole("combobox");
	await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
	await expect.element(trigger).not.toHaveAttribute("aria-controls");

	await trigger.click();
	const listbox = page.getByRole("listbox");
	await expect.element(listbox).toHaveAttribute("id", listboxId);
	await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
	await expect.element(trigger).toHaveAttribute("aria-controls", listboxId);

	await userEvent.keyboard("{Escape}");
	await expect.element(listbox).not.toBeInTheDocument();
	await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
	await expect.element(trigger).not.toHaveAttribute("aria-controls");
}

async function expectNotHighlighted(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).not.toHaveAttribute("data-highlighted");
		}
	} else {
		await expect.element(node).not.toHaveAttribute("data-highlighted");
	}
}

it("should not open when the trigger is disabled by an ancestor `fieldset`", async () => {
	render(SelectFieldsetDisabledTest);
	const trigger = page.getByTestId("trigger");
	await expect.element(trigger).toBeDisabled();

	async function expectClosed() {
		await new Promise((r) => setTimeout(r, 100));
		expect(page.getByTestId("open-binding").element()).toHaveTextContent("false");
		expect(page.getByTestId("content").query()).toBeNull();
	}

	// browsers still dispatch pointer events to disabled form controls
	await trigger.click({ force: true });
	await expectClosed();

	trigger
		.element()
		.dispatchEvent(new PointerEvent("pointerup", { pointerType: "touch", bubbles: true }));
	await expectClosed();
});

describe("Settling content", () => {
	function itemInView(viewport: HTMLElement, item: HTMLElement) {
		const v = viewport.getBoundingClientRect();
		const i = item.getBoundingClientRect();
		return i.top >= v.top - 1 && i.bottom <= v.bottom + 1;
	}

	// a resize observer delivers after layout, before paint; two frames is past that
	function afterResizeDelivery() {
		return new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		);
	}

	async function openOnLastItem() {
		render(SelectSettlingContentTest, { value: "59" });
		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));
		const viewport = page.getByTestId("viewport").element() as HTMLElement;
		const item = page.getByTestId("item-59").element() as HTMLElement;
		const footer = page.getByTestId("footer").element() as HTMLElement;
		await vi.waitFor(() => expect(itemInView(viewport, item)).toBe(true));
		// the observer's initial notification is behind us before anything resizes
		await afterResizeDelivery();
		return { viewport, item, footer };
	}

	async function growFooter(viewport: HTMLElement, footer: HTMLElement, height: string) {
		const before = viewport.getBoundingClientRect().height;
		footer.style.height = height;
		await vi.waitFor(() =>
			expect(viewport.getBoundingClientRect().height).toBeLessThan(before)
		);
		await afterResizeDelivery();
	}

	it("should keep the selected item in view while chrome mounts after the content is positioned", async () => {
		const { viewport, item, footer } = await openOnLastItem();
		// chrome that takes its height only once the content is placed shrinks the
		// viewport under the alignment that just put the selection on screen — twice,
		// so one delayed alignment is not enough
		await growFooter(viewport, footer, "48px");
		await vi.waitFor(() => expect(itemInView(viewport, item)).toBe(true));
		await growFooter(viewport, footer, "96px");
		await vi.waitFor(() => expect(itemInView(viewport, item)).toBe(true));
	});

	it("should stop realigning once the user has scrolled", async () => {
		const { viewport, footer } = await openOnLastItem();
		viewport.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: -100 }));
		viewport.scrollTop = 0;
		await growFooter(viewport, footer, "48px");
		expect(viewport.scrollTop).toBe(0);
	});
});

describe("select - activation without a pointer press", () => {
	it("should toggle the trigger on a click that no pointer press preceded", async () => {
		const t = setupSingle();
		(t.trigger.element() as HTMLElement).click();
		await expectExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expect.element(t.trigger).toHaveFocus();
		(t.trigger.element() as HTMLElement).click();
		await expectNotExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("false");
	});

	it("should open on the event sequence of a WebKit accessibility press", async () => {
		const t = setupSingle();
		const trigger = t.trigger.element() as HTMLElement;
		// focus, mousedown, mouseup and a zero-`detail` click, with no pointer events
		trigger.focus();
		for (const type of ["mousedown", "mouseup", "click"]) {
			trigger.dispatchEvent(
				new MouseEvent(type, { bubbles: true, cancelable: true, detail: 0 })
			);
		}
		await expectExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("true");
	});

	it("should not toggle again on the click that ends a mouse press", async () => {
		const onOpenChange = vi.fn();
		const t = setupSingle({ onOpenChange });
		await t.trigger.click();
		await expectExists(t.getContent());
		expect(onOpenChange).toHaveBeenCalledTimes(1);
	});

	it("should not toggle again on the click that ends a tap", async () => {
		const onOpenChange = vi.fn();
		const t = setupSingle({ onOpenChange });
		const trigger = t.trigger.element();
		for (const type of ["pointerdown", "pointerup"] as const) {
			trigger.dispatchEvent(
				new PointerEvent(type, {
					bubbles: true,
					cancelable: true,
					pointerType: "touch",
					isPrimary: true,
					button: 0,
					buttons: type === "pointerdown" ? 1 : 0,
				})
			);
		}
		// a touch click can arrive in a later task than the `pointerup` (Chromium on Android)
		await new Promise((resolve) => setTimeout(resolve));
		trigger.dispatchEvent(
			new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 })
		);
		await expectExists(t.getContent());
		expect(onOpenChange).toHaveBeenCalledTimes(1);
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"should toggle once when %s is pressed on the trigger",
		async (key) => {
			const onOpenChange = vi.fn();
			const t = setupSingle({ onOpenChange });
			(t.trigger.element() as HTMLElement).focus();
			await userEvent.keyboard(key);
			await expectExists(t.getContent());
			expect(onOpenChange).toHaveBeenCalledTimes(1);
		}
	);

	it("should stay open when a space is typed during typeahead", async () => {
		const t = setupSingle({}, [
			{ value: "1", label: "Apple pie" },
			{ value: "2", label: "Apple tart" },
		]);
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		await expectExists(t.getContent());
		await userEvent.keyboard("Apple t");
		await expectHighlighted(page.getByTestId("2"));
		await expectExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("true");
	});

	it("should not toggle on a click without a pointer press when disabled", async () => {
		const onOpenChange = vi.fn();
		// a `div` trigger, which unlike a disabled `<button>` still receives the click
		render(SelectChildTriggerTest, { onOpenChange, disabled: true });
		(page.getByTestId("trigger").element() as HTMLElement).click();
		await expectNotExists(page.getByTestId("content"));
		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
