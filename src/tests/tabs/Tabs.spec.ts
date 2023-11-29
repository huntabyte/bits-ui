import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import TabsTest from "./TabsTest.svelte";
import type { Item } from "./TabsTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { Tabs } from "$lib";

type Props = Tabs.Props & { items?: Item[] };

const items: Item[] = [
	{
		value: "1",
		disabled: false
	},
	{
		value: "2",
		disabled: false
	},
	{
		value: "3",
		disabled: false
	}
];

function setup(props: Props = {}) {
	const user = userEvent.setup();
	const withDefaults = { ...{ items }, ...props };
	const returned = render(TabsTest, withDefaults);
	return {
		user,
		...returned
	};
}

describe("Tabs", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(TabsTest, {
			items: [
				{
					value: "1",
					disabled: false
				}
			],
			value: "1"
		});
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(TabsTest, {
			items: [items[0]]
		});

		const root = getByTestId("root");
		const list = getByTestId("list");
		const trigger = getByTestId("trigger-1");
		const content = getByTestId("content-1");

		expect(root).toHaveAttribute("data-tabs-root");
		expect(list).toHaveAttribute("data-tabs-list");
		expect(trigger).toHaveAttribute("data-tabs-trigger");
		expect(content).toHaveAttribute("data-tabs-content");
	});

	it("switches tabs on click", async () => {
		const { getByTestId, user } = setup();

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");

		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();

		await user.click(trigger2);
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		expect(content3).not.toBeVisible();

		await user.click(trigger3);
		expect(content1).not.toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();

		await user.click(trigger1);
		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();
	});

	it("navigates the tabs with the keyboard", async () => {
		const { getByTestId, user } = setup();

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it("respects the loop prop", async () => {
		const { getByTestId, user } = setup({ loop: false });

		const trigger1 = getByTestId("trigger-1");
		const trigger3 = getByTestId("trigger-3");

		trigger1.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).not.toHaveFocus();
		expect(trigger1).toHaveFocus();

		trigger3.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).not.toHaveFocus();
		expect(trigger3).toHaveFocus();
	});

	it("respects the `activateOnFocus` prop", async () => {
		const { getByTestId, user } = setup({
			activateOnFocus: false
		});

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		await user.keyboard(kbd.ENTER);
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
	});
	it("navigates using up & down when orientation is vertical", async () => {
		const { getByTestId, user } = setup({
			orientation: "vertical"
		});

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it.todo("`asChild` behavior");
});
