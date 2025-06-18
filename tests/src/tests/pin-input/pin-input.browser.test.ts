import { expect, it, vi, afterEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { REGEXP_ONLY_DIGITS } from "bits-ui";
import { getTestKbd, sleep } from "../utils.js";
import PinInputTest from "./pin-input-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";
import { type ComponentProps } from "svelte";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof PinInputTest>> = {}) {
	const user = setupBrowserUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(PinInputTest, { ...props });
	const cells = new Array(6).fill(null).map((_, i) => returned.getByTestId(`cell-${i}`));
	const binding = returned.getByTestId("binding").element() as HTMLElement;
	const hiddenInput = returned.getByTestId("input").element() as HTMLInputElement;

	async function copyAndPaste() {
		await user.tripleClick(returned.getByTestId("to-copy"));
		await user.copy();
		await user.click(hiddenInput);
		await user.paste();
	}

	return {
		user,
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
	const { hiddenInput } = setup({ name: "test" });
	expect(hiddenInput).toHaveAttribute("name", "test");
});

it("should sync the `value` prop to the hidden input", async () => {
	const value = "123456";
	const { hiddenInput } = setup({ value });
	expect(hiddenInput).toHaveValue(value);
});

it("should sync the `disabled` prop to the hidden input", async () => {
	const t = setup({ disabled: true });
	expect(t.hiddenInput).toHaveAttribute("disabled", "");
});

it("should respect binding to the `value` prop", async () => {
	const initialValue = "123456";
	const t = setup({
		value: initialValue,
	});
	expect(t.hiddenInput).toHaveValue(initialValue);
	expect(t.binding).toHaveTextContent(initialValue);
	await t.user.click(t.binding);
	expect(t.hiddenInput).toHaveValue("999999");
	expect(t.binding).toHaveTextContent("999999");
});

it("should set the appropriate `isActive` prop on each cell", async () => {
	const mocked = vi.fn();
	const t = setup({
		onComplete: mocked,
	});

	await t.user.click(t.hiddenInput);
	await vi.waitFor(() => expect(t.cells[0]).toHaveAttribute("data-active"));
	await t.user.keyboard("1");
	await vi.waitFor(() => expect(t.cells[0]).not.toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[1]).toHaveAttribute("data-active"));
	await t.user.keyboard("2");
	await vi.waitFor(() => expect(t.cells[1]).not.toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[2]).toHaveAttribute("data-active"));
	await t.user.keyboard("3");
	await vi.waitFor(() => expect(t.cells[2]).not.toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[3]).toHaveAttribute("data-active"));
	await t.user.keyboard("4");
	await vi.waitFor(() => expect(t.cells[3]).not.toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[4]).toHaveAttribute("data-active"));
	await t.user.keyboard("5");
	await vi.waitFor(() => expect(t.cells[4]).not.toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[5]).toHaveAttribute("data-active"));
	await t.user.keyboard("6");
	await vi.waitFor(() => expect(mocked).toHaveBeenCalledTimes(1));
});

it("should handle backspace appropriately", async () => {
	const t = setup();

	await t.user.click(t.hiddenInput);
	await t.user.fill(t.hiddenInput, "123");
	await t.user.keyboard(kbd.BACKSPACE);
	await vi.waitFor(() => expect(t.cells[2]).toHaveTextContent(""));
	await vi.waitFor(() => expect(t.cells[2]).toHaveAttribute("data-active"));
	await t.user.keyboard(kbd.BACKSPACE);
	await vi.waitFor(() => expect(t.cells[1]).toHaveTextContent(""));
	await vi.waitFor(() => expect(t.cells[1]).toHaveAttribute("data-active"));
	await vi.waitFor(() => expect(t.cells[2]).not.toHaveAttribute("data-active"));
});

it("should fire the `onComplete` callback when the input is complete", async () => {
	const mockComplete = vi.fn();
	const { user, hiddenInput } = setup({
		onComplete: mockComplete,
	});

	await user.click(hiddenInput);
	const keys = ["1", "2", "3", "4", "5", "6"];
	for (const key of keys) {
		await user.keyboard(key);
	}
	expect(mockComplete).toHaveBeenCalledTimes(1);
	for (const _key of keys) {
		await user.keyboard(kbd.BACKSPACE);
	}

	for (const key of keys) {
		await user.keyboard(key);
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

	await t.user.click(t.hiddenInput);
	await t.user.keyboard("123");
	expect(t.hiddenInput).toHaveValue("123");

	await t.user.keyboard(kbd.BACKSPACE);
	await t.user.keyboard(kbd.BACKSPACE);
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.hiddenInput).toHaveValue("");
	await t.user.keyboard("$");
	expect(t.hiddenInput).toHaveValue("");
	await t.user.keyboard("1$");
	expect(t.hiddenInput).toHaveValue("1");
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
	await sleep(100);

	expect(mockComplete).toHaveBeenCalledTimes(1);
	expect(mockComplete).toHaveBeenCalledWith("123456");
});
