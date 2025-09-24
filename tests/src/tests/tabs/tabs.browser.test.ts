import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import TabsTest from "./tabs-test.svelte";
import type { Item, TabsTestProps } from "./tabs-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

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
	const withDefaults = { ...{ items }, ...props };
	render(TabsTest, withDefaults);
}

describe("Tabs", () => {
	it("should have bits data attrs", async () => {
		render(TabsTest, {
			items: [items[0] as Item],
		});

		const root = page.getByTestId("root");
		const list = page.getByTestId("list");
		const trigger = page.getByTestId("trigger-1");
		const content = page.getByTestId("content-1");

		await expect.element(root).toHaveAttribute("data-tabs-root");
		await expect.element(list).toHaveAttribute("data-tabs-list");
		await expect.element(trigger).toHaveAttribute("data-tabs-trigger");
		await expect.element(content).toHaveAttribute("data-tabs-content");
	});

	it("should switch tabs on click", async () => {
		setup();

		const trigger1 = page.getByTestId("trigger-1");
		const trigger2 = page.getByTestId("trigger-2");
		const trigger3 = page.getByTestId("trigger-3");

		const content1 = page.getByTestId("content-1");
		const content2 = page.getByTestId("content-2");
		const content3 = page.getByTestId("content-3");

		await expect.element(content1).toBeVisible();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content3).not.toBeVisible();

		await trigger2.click();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content2).toBeVisible();
		await expect.element(content3).not.toBeVisible();

		await trigger3.click();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content3).toBeVisible();

		await trigger1.click();
		await expect.element(content1).toBeVisible();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content3).not.toBeVisible();
	});

	it("should navigate the tabs with the keyboard", async () => {
		setup();

		const trigger1 = page.getByTestId("trigger-1");
		const trigger2 = page.getByTestId("trigger-2");
		const trigger3 = page.getByTestId("trigger-3");
		const content1 = page.getByTestId("content-1");
		const content2 = page.getByTestId("content-2");
		const content3 = page.getByTestId("content-3");

		(trigger1.element() as HTMLElement).focus();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger2).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content2).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content3).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger1).toHaveFocus();
		await expect.element(content3).not.toBeVisible();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content3).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(trigger2).toHaveFocus();
		await expect.element(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(trigger1).toHaveFocus();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content3).toBeVisible();
	});

	it("should respect the loop prop", async () => {
		setup({ loop: false });

		const trigger1 = page.getByTestId("trigger-1");
		const trigger3 = page.getByTestId("trigger-3");

		(trigger1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(trigger3).not.toHaveFocus();
		await expect.element(trigger1).toHaveFocus();

		(trigger3.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger1).not.toHaveFocus();
		await expect.element(trigger3).toHaveFocus();
	});

	it("should respect the `activationMode: 'manual'` prop", async () => {
		setup({
			activationMode: "manual",
		});

		const trigger1 = page.getByTestId("trigger-1");
		const trigger2 = page.getByTestId("trigger-2");
		const trigger3 = page.getByTestId("trigger-3");
		const content1 = page.getByTestId("content-1");
		const content2 = page.getByTestId("content-2");
		const content3 = page.getByTestId("content-3");

		(trigger1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger2).toHaveFocus();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content3).not.toBeVisible();
		await expect.element(content1).toBeVisible();
	});

	it("should navigate using up & down when orientation is vertical", async () => {
		setup({
			orientation: "vertical",
		});

		const trigger1 = page.getByTestId("trigger-1");
		const trigger2 = page.getByTestId("trigger-2");
		const trigger3 = page.getByTestId("trigger-3");
		const content1 = page.getByTestId("content-1");
		const content2 = page.getByTestId("content-2");
		const content3 = page.getByTestId("content-3");

		(trigger1.element() as HTMLElement).focus();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(trigger2).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content2).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content3).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(trigger1).toHaveFocus();
		await expect.element(content3).not.toBeVisible();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content3).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(trigger2).toHaveFocus();
		await expect.element(content3).not.toBeVisible();
		await expect.element(content2).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(trigger1).toHaveFocus();
		await expect.element(content2).not.toBeVisible();
		await expect.element(content1).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(trigger3).toHaveFocus();
		await expect.element(content1).not.toBeVisible();
		await expect.element(content3).toBeVisible();
	});

	it("should apply appropriate `aria-controls` and `aria-labelledby` attributes to the `Tabs.Trigger` and `Tabs.Content` components", async () => {
		setup();
		const triggers = [
			page.getByTestId("trigger-1"),
			page.getByTestId("trigger-2"),
			page.getByTestId("trigger-3"),
		];

		const contents = [
			page.getByTestId("content-1"),
			page.getByTestId("content-2"),
			page.getByTestId("content-3"),
		];

		for (let i = 0; i < triggers.length; i++) {
			const trigger = triggers[i];
			const content = contents[i];

			await expect.element(content).toHaveAttribute("role", "tabpanel");
			await expect.element(trigger).toHaveAttribute("role", "tab");
			await expect.element(trigger).toHaveAttribute("aria-controls", content.element().id);
			await expect.element(content).toHaveAttribute("aria-labelledby", trigger.element().id);
		}
	});

	it("should apply tabindex 0 to the active tab trigger on mount", async () => {
		setup({
			value: "2",
		});
		const [trigger1, trigger2, trigger3] = [
			page.getByTestId("trigger-1"),
			page.getByTestId("trigger-2"),
			page.getByTestId("trigger-3"),
		];

		await expect.element(trigger1).toHaveAttribute("tabindex", "-1");
		await expect.element(trigger2).toHaveAttribute("tabindex", "0");
		await expect.element(trigger3).toHaveAttribute("tabindex", "-1");
	});
});
