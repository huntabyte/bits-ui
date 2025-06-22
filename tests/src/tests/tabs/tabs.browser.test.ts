import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import TabsTest from "./tabs-test.svelte";
import type { Item, TabsTestProps } from "./tabs-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

const items: Item[] = [
	{
		value: "1",
		disabled: false,
	},
	{
		value: "2",
		disabled: false,
	},
	{
		value: "3",
		disabled: false,
	},
];

function setup(props: Partial<TabsTestProps> = {}) {
	const user = setupBrowserUserEvents();
	const withDefaults = { ...{ items }, ...props };
	const returned = render(TabsTest, withDefaults);
	return {
		user,
		...returned,
	};
}

describe("Tabs", () => {
	it("should have bits data attrs", async () => {
		const t = render(TabsTest, {
			items: [items[0] as Item],
		});

		const root = t.getByTestId("root");
		const list = t.getByTestId("list");
		const trigger = t.getByTestId("trigger-1");
		const content = t.getByTestId("content-1");

		expect(root).toHaveAttribute("data-tabs-root");
		expect(list).toHaveAttribute("data-tabs-list");
		expect(trigger).toHaveAttribute("data-tabs-trigger");
		expect(content).toHaveAttribute("data-tabs-content");
	});

	it("should switch tabs on click", async () => {
		const t = setup();

		const trigger1 = t.getByTestId("trigger-1");
		const trigger2 = t.getByTestId("trigger-2");
		const trigger3 = t.getByTestId("trigger-3");

		const content1 = t.getByTestId("content-1");
		const content2 = t.getByTestId("content-2");
		const content3 = t.getByTestId("content-3");

		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();

		await t.user.click(trigger2);
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		expect(content3).not.toBeVisible();

		await t.user.click(trigger3);
		expect(content1).not.toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();

		await t.user.click(trigger1);
		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();
	});

	it("should navigate the tabs with the keyboard", async () => {
		const t = setup();

		const trigger1 = t.getByTestId("trigger-1").element() as HTMLElement;
		const trigger2 = t.getByTestId("trigger-2").element() as HTMLElement;
		const trigger3 = t.getByTestId("trigger-3").element() as HTMLElement;
		const content1 = t.getByTestId("content-1").element() as HTMLElement;
		const content2 = t.getByTestId("content-2").element() as HTMLElement;
		const content3 = t.getByTestId("content-3").element() as HTMLElement;

		trigger1.focus();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it("should respect the loop prop", async () => {
		const t = setup({ loop: false });

		const trigger1 = t.getByTestId("trigger-1").element() as HTMLElement;
		const trigger3 = t.getByTestId("trigger-3").element() as HTMLElement;

		trigger1.focus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).not.toHaveFocus();
		expect(trigger1).toHaveFocus();

		trigger3.focus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).not.toHaveFocus();
		expect(trigger3).toHaveFocus();
	});

	it("should respect the `activationMode: 'manual'` prop", async () => {
		const t = setup({
			activationMode: "manual",
		});

		const trigger1 = t.getByTestId("trigger-1").element() as HTMLElement;
		const trigger2 = t.getByTestId("trigger-2").element() as HTMLElement;
		const trigger3 = t.getByTestId("trigger-3").element() as HTMLElement;
		const content1 = t.getByTestId("content-1").element() as HTMLElement;
		const content2 = t.getByTestId("content-2").element() as HTMLElement;
		const content3 = t.getByTestId("content-3").element() as HTMLElement;

		trigger1.focus();
		await t.user.keyboard(kbd.ENTER);
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
	});

	it("should navigate using up & down when orientation is vertical", async () => {
		const t = setup({
			orientation: "vertical",
		});

		const trigger1 = t.getByTestId("trigger-1").element() as HTMLElement;
		const trigger2 = t.getByTestId("trigger-2").element() as HTMLElement;
		const trigger3 = t.getByTestId("trigger-3").element() as HTMLElement;
		const content1 = t.getByTestId("content-1").element() as HTMLElement;
		const content2 = t.getByTestId("content-2").element() as HTMLElement;
		const content3 = t.getByTestId("content-3").element() as HTMLElement;

		trigger1.focus();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it("should apply appropriate `aria-controls` and `aria-labelledby` attributes to the `Tabs.Trigger` and `Tabs.Content` components", async () => {
		const t = setup();
		const triggers = [
			t.getByTestId("trigger-1"),
			t.getByTestId("trigger-2"),
			t.getByTestId("trigger-3"),
		];

		const contents = [
			t.getByTestId("content-1"),
			t.getByTestId("content-2"),
			t.getByTestId("content-3"),
		];

		for (let i = 0; i < triggers.length; i++) {
			const trigger = triggers[i]!.element() as HTMLElement;
			const content = contents[i]!.element() as HTMLElement;

			expect(content).toHaveAttribute("role", "tabpanel");
			expect(trigger).toHaveAttribute("role", "tab");
			expect(trigger.getAttribute("aria-controls")).toBe(content.id);
			expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
		}
	});

	it("should apply tabindex 0 to the active tab trigger on mount", async () => {
		const t = setup({
			value: "2",
		});
		const [trigger1, trigger2, trigger3] = [
			t.getByTestId("trigger-1").element() as HTMLElement,
			t.getByTestId("trigger-2").element() as HTMLElement,
			t.getByTestId("trigger-3").element() as HTMLElement,
		];

		expect(trigger1).toHaveAttribute("tabindex", "-1");
		expect(trigger2).toHaveAttribute("tabindex", "0");
		expect(trigger3).toHaveAttribute("tabindex", "-1");
	});
});
