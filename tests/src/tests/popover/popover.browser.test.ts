import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import PopoverTest, { type PopoverTestProps } from "./popover-test.svelte";
import PopoverForceMountTest, {
	type PopoverForceMountTestProps,
} from "./popover-force-mount-test.svelte";
import PopoverSiblingsTest from "./popover-siblings-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(
	props: PopoverTestProps | PopoverForceMountTestProps = {},
	component: Component = PopoverTest
) {
	const user = setupBrowserUserEvents();

	const returned = render(component, { ...props });

	const trigger = returned.getByTestId("trigger").element() as HTMLElement;
	function getContent() {
		return returned.getByTestId("content");
	}
	return { trigger, user, getContent, ...returned };
}

async function open(props: PopoverTestProps = {}, openWith: "click" | (string & {}) = "click") {
	const { trigger, getByTestId, user, getContent, ...returned } = setup(props);
	expectNotExists(getContent());
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	expectExists(getContent());
	const content = getByTestId("content");
	return { trigger, getByTestId, user, content, getContent, ...returned };
}

it("should have bits data attrs", async () => {
	const t = await open();
	const parts = ["trigger", "content", "close", "arrow"];

	for (const part of parts) {
		const el = t.getByTestId(part);
		expect(el).toHaveAttribute(`data-popover-${part}`);
	}
});

it("should open on click", async () => {
	await open();
});

it("should open on enter", async () => {
	await open({}, kbd.ENTER);
});

it("should open on space", async () => {
	await open({}, kbd.SPACE);
});

it("should close on escape keydown by default", async () => {
	const { user, getContent } = await open();
	await user.keyboard(kbd.ESCAPE);
	expectNotExists(getContent());
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await t.user.click(t.getByTestId("outside"));

	expect(mockFn).toHaveBeenCalledTimes(1);

	vi.resetAllMocks();
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await t.user.click(t.getContent());

	expect(t.getContent()).toBeVisible();
});

it("should close when the close button is clicked", async () => {
	const t = await open();
	await t.user.click(t.getByTestId("close"));
	expectNotExists(t.getContent());
});

it("should portal to the body by default", async () => {
	const t = await open();
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(document.body);
});

it("should portal to a custom element if specified", async () => {
	const t = await open({ portalProps: { to: "#portal-target" } });
	const portalTarget = t.getByTestId("portal-target").element() as HTMLElement;
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(portalTarget);
});

it("should not portal if `disabled` is passed to the portal ", async () => {
	const t = await open({
		portalProps: {
			disabled: true,
		},
	});
	const main = t.getByTestId("main").element() as HTMLElement;
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(main);
});

it("should allow ignoring the escapeKeydownBehavior ", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	expect(t.getContent()).toBeVisible();
});

it("should allow cancelling the `onEscapeKeydown` event", async () => {
	let preventedCount = 0;
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "close",
			onEscapeKeydown: (e) => {
				if (preventedCount > 0) return;
				e.preventDefault();
				preventedCount++;
			},
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	expectExists(t.getContent());
	await t.user.keyboard(kbd.ESCAPE);
	expectNotExists(t.getContent());
});

it("should allow ignoring the interactOutsideBehavior", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await t.user.click(t.getByTestId("outside"));
	expectExists(t.getContent());
});

it("should allow binding the `open` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const binding = t.getByTestId("binding").element() as HTMLElement;
	expect(binding).toHaveTextContent("true");
	await t.user.click(binding);
	expect(binding).toHaveTextContent("false");
	expectNotExists(t.getContent());
	await t.user.click(binding);
	expect(binding).toHaveTextContent("true");
	expectExists(t.getContent());
});

it("should forceMount the content when `forceMount` is true", async () => {
	const t = setup({}, PopoverForceMountTest);

	expectExists(t.getContent());
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = setup({ withOpenCheck: true }, PopoverForceMountTest);
	expectNotExists(t.getContent());
	await t.user.click(t.getByTestId("trigger"));
	expectExists(t.getContent());
});

it("should correctly handle focus when closing one popover by clicking another popover's trigger", async () => {
	const user = setupBrowserUserEvents();
	const t = render(PopoverSiblingsTest);
	await user.click(t.getByTestId("open-1"));
	expectExists(t.getByTestId("content-1"));
	await user.click(t.getByTestId("open-2"));
	expectNotExists(t.getByTestId("content-1"));
	expectExists(t.getByTestId("content-2"));
	expect(t.getByTestId("close-2")).toHaveFocus();
	await user.click(t.getByTestId("open-3"));
	expectNotExists(t.getByTestId("content-2"));
	expectExists(t.getByTestId("content-3"));
	expect(t.getByTestId("close-3")).toHaveFocus();
	await user.click(t.getByTestId("close-3"));
	expectNotExists(t.getByTestId("content-3"));
});
