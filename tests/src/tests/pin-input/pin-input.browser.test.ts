import { expect, it, vi, afterEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { REGEXP_ONLY_DIGITS } from "bits-ui";
import { getTestKbd } from "../utils.js";
import PinInputTest from "./pin-input-test.svelte";
import { tick, type ComponentProps } from "svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof PinInputTest>> = {}) {
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(PinInputTest, { ...props });
	const cells = new Array(6).fill(null).map((_, i) => returned.getByTestId(`cell-${i}`));
	const binding = returned.getByTestId("binding");
	const hiddenInput = returned.getByTestId("input");

	async function copyAndPaste() {
		const toCopy = page.getByTestId("to-copy");
		await toCopy.tripleClick();
		await userEvent.copy();
		await hiddenInput.click();
		await userEvent.paste();
	}

	return {
		cells,
		binding,
		hiddenInput,
		copyAndPaste,
		...returned,
	};
}

afterEach(() => {
	vi.resetAllMocks();
});

it("should sync the `name` prop to the hidden input", async () => {
	const t = setup({ name: "test" });
	await expect.element(t.hiddenInput).toHaveAttribute("name", "test");
});

it("should sync the `value` prop to the hidden input", async () => {
	const value = "123456";
	const t = setup({ value });
	await expect.element(t.hiddenInput).toHaveValue(value);
});

it("should sync the `disabled` prop to the hidden input", async () => {
	const t = setup({ disabled: true });
	await expect.element(t.hiddenInput).toHaveAttribute("disabled", "");
});

it("should respect binding to the `value` prop", async () => {
	const initialValue = "123456";
	const t = setup({
		value: initialValue,
	});
	await expect.element(t.hiddenInput).toHaveValue(initialValue);
	await expect.element(t.binding).toHaveTextContent(initialValue);
	await t.binding.click();
	await expect.element(t.hiddenInput).toHaveValue("999999");
	await expect.element(t.binding).toHaveTextContent("999999");
});

it("should set the appropriate `isActive` prop on each cell", async () => {
	const mocked = vi.fn();
	const t = setup({
		onComplete: mocked,
	});

	await t.hiddenInput.click();
	await expect.element(t.cells[0]).toHaveAttribute("data-active");
	await userEvent.keyboard("1");
	await expect.element(t.cells[0]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[1]).toHaveAttribute("data-active");
	await userEvent.keyboard("2");
	await expect.element(t.cells[1]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[2]).toHaveAttribute("data-active");
	await userEvent.keyboard("3");
	await expect.element(t.cells[2]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[3]).toHaveAttribute("data-active");
	await userEvent.keyboard("4");
	await expect.element(t.cells[3]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[4]).toHaveAttribute("data-active");
	await userEvent.keyboard("5");
	await expect.element(t.cells[4]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[5]).toHaveAttribute("data-active");
	await userEvent.keyboard("6");
	await vi.waitFor(() => expect(mocked).toHaveBeenCalledTimes(1));
});

it("should handle backspace appropriately", async () => {
	const t = setup();

	await t.hiddenInput.click();
	await t.hiddenInput.fill("123");
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.cells[2]).toHaveTextContent("");
	await expect.element(t.cells[2]).toHaveAttribute("data-active");
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.cells[1]).toHaveTextContent("");
	await expect.element(t.cells[1]).toHaveAttribute("data-active");
	await expect.element(t.cells[2]).not.toHaveAttribute("data-active");
});

it("should fire the `onComplete` callback when the input is complete", async () => {
	const mockComplete = vi.fn();
	const t = setup({
		onComplete: mockComplete,
	});

	await t.hiddenInput.click();
	const keys = ["1", "2", "3", "4", "5", "6"];
	for (const key of keys) {
		await userEvent.keyboard(key);
	}
	expect(mockComplete).toHaveBeenCalledTimes(1);
	for (const _key of keys) {
		await userEvent.keyboard(kbd.BACKSPACE);
	}

	for (const key of keys) {
		await userEvent.keyboard(key);
	}
	expect(mockComplete).toHaveBeenCalledTimes(2);
});

it("should handle paste events correctly", async () => {
	const mockComplete = vi.fn();
	const t = setup({
		onComplete: mockComplete,
		toCopy: "123456",
	});

	await t.copyAndPaste();

	expect(mockComplete).toHaveBeenCalledTimes(1);
	expect(mockComplete).toHaveBeenCalledWith("123456");
});

it("should allow the user to sanitize pasted text (remove hyphens, etc.)", async () => {
	const mockComplete = vi.fn();
	const t = setup({
		onComplete: mockComplete,
		pasteTransformer: (text) => text.replace(/-/g, ""),
		toCopy: "123-456",
	});

	await t.copyAndPaste();

	expect(mockComplete).toHaveBeenCalledTimes(1);
	expect(mockComplete).toHaveBeenCalledWith("123456");
});

it("should ignore keys that do not match the pattern", async () => {
	const t = setup({
		pattern: REGEXP_ONLY_DIGITS,
	});

	await t.hiddenInput.click();
	await userEvent.keyboard("123");
	await expect.element(t.hiddenInput).toHaveValue("123");

	await userEvent.keyboard(kbd.BACKSPACE);
	await userEvent.keyboard(kbd.BACKSPACE);
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.hiddenInput).toHaveValue("");
	await userEvent.keyboard("$");
	await expect.element(t.hiddenInput).toHaveValue("");
	await userEvent.keyboard("1$");
	await expect.element(t.hiddenInput).toHaveValue("1");
});

it("should allow pasting numbers that match the pattern", async () => {
	const mockComplete = vi.fn();
	const mockClipboard = "123456";

	const t = setup({
		pattern: REGEXP_ONLY_DIGITS,
		onComplete: mockComplete,
		toCopy: mockClipboard,
	});

	await t.copyAndPaste();

	expect(mockComplete).toHaveBeenCalledTimes(1);
	expect(mockComplete).toHaveBeenCalledWith("123456");
});

it("should not allow pasting numbers that do not match the pattern", async () => {
	const mockComplete = vi.fn();
	const mockClipboard = "abcdef";

	const t = setup({
		pattern: REGEXP_ONLY_DIGITS,
		onComplete: mockComplete,
		toCopy: mockClipboard,
	});

	await t.copyAndPaste();

	expect(mockComplete).toHaveBeenCalledTimes(0);
});

it("should allow pasting more than the max-length if transformation is provided", async () => {
	const mockComplete = vi.fn();
	const mockClipboard = "1-2-3-4-5-6";

	const t = setup({
		maxlength: 6,
		onComplete: mockComplete,
		pasteTransformer: (text) => text.replace(/-/g, ""),
		toCopy: mockClipboard,
	});

	await t.copyAndPaste();

	expect(mockComplete).toHaveBeenCalledTimes(1);
	expect(mockComplete).toHaveBeenCalledWith("123456");
});

it.only("should handle ArrowLeft navigation correctly", async () => {
	const t = setup();

	await t.hiddenInput.click();
	await userEvent.keyboard("1");
	await userEvent.keyboard("2");
	await userEvent.keyboard("3");
	await userEvent.keyboard("4");
	await expect.element(t.hiddenInput).toHaveValue("1234");
	await expect.element(t.cells[4]).toHaveAttribute("data-active");

	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[3]).toHaveAttribute("data-active");
	await tick();
	await expect.element(t.cells[3]).toHaveAttribute("data-active");
	await expect.element(t.cells[4]).not.toHaveAttribute("data-active");
	await expect.element(t.cells[2]).not.toHaveAttribute("data-active");

	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[1]).toHaveAttribute("data-active");
	await expect.element(t.cells[2]).not.toHaveAttribute("data-active");

	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[0]).toHaveAttribute("data-active");
	await expect.element(t.cells[1]).not.toHaveAttribute("data-active");
});

it("should correctly replace characters when navigating back and typing", async () => {
	const t = setup();

	await t.hiddenInput.click();
	await t.hiddenInput.fill("1234");
	await expect.element(t.hiddenInput).toHaveValue("1234");

	// navigate to beginning using Home
	await userEvent.keyboard(kbd.HOME);
	await expect.element(t.cells[0]).toHaveAttribute("data-active");

	// type 5 and 6 - should replace first two characters
	await userEvent.keyboard("5");
	await expect.element(t.hiddenInput).toHaveValue("5234");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveAttribute("data-active");

	await userEvent.keyboard("6");
	await expect.element(t.hiddenInput).toHaveValue("5634");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveTextContent("6");
	await expect.element(t.cells[2]).toHaveTextContent("3");
	await expect.element(t.cells[3]).toHaveTextContent("4");
});

it("should correctly replace characters when navigating back with ArrowLeft and typing", async () => {
	const t = setup();

	await t.hiddenInput.click();
	await t.hiddenInput.fill("1234");
	await expect.element(t.hiddenInput).toHaveValue("1234");

	// navigate back using ArrowLeft
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[2]).toHaveAttribute("data-active");

	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[1]).toHaveAttribute("data-active");

	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.cells[0]).toHaveAttribute("data-active");

	// type 5 and 6 - should replace first two characters
	await userEvent.keyboard("5");
	await expect.element(t.hiddenInput).toHaveValue("5234");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveAttribute("data-active");

	await userEvent.keyboard("6");
	await expect.element(t.hiddenInput).toHaveValue("5634");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveTextContent("6");
	await expect.element(t.cells[2]).toHaveTextContent("3");
	await expect.element(t.cells[3]).toHaveTextContent("4");
});

it("should correctly replace characters when navigating with ArrowUp and typing", async () => {
	const t = setup();

	await t.hiddenInput.click();
	await t.hiddenInput.fill("1234");
	await expect.element(t.hiddenInput).toHaveValue("1234");

	// navigate to beginning using ArrowUp (equivalent to Home)
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.cells[0]).toHaveAttribute("data-active");

	// type 5 and 6 - should replace first two characters
	await userEvent.keyboard("5");
	await expect.element(t.hiddenInput).toHaveValue("5234");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveAttribute("data-active");

	await userEvent.keyboard("6");
	await expect.element(t.hiddenInput).toHaveValue("5634");
	await expect.element(t.cells[0]).toHaveTextContent("5");
	await expect.element(t.cells[1]).toHaveTextContent("6");
	await expect.element(t.cells[2]).toHaveTextContent("3");
	await expect.element(t.cells[3]).toHaveTextContent("4");
});
