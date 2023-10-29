import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SelectTest from "./SelectTest.svelte";
import type { Item } from "./SelectTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { RadioGroup, Select } from "$lib";

const testItems: Item[] = [
	{
		value: "1",
		label: "A"
	},
	{
		value: "2",
		label: "B"
	},
	{
		value: "3",
		label: "C"
	},
	{
		value: "4",
		label: "D"
	}
];

function setup(props: RadioGroup.Props = {}, items: Item[] = testItems) {
	const user = userEvent.setup();
	const returned = render(SelectTest, { ...props, items });
	const trigger = returned.getByTestId("trigger");
	return {
		trigger,
		user,
		...returned
	};
}
async function open(props: Select.Props = {}, openWith: "click" | (string & {}) = "click") {
	const { trigger, getByTestId, queryByTestId, user } = setup(props);
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return { trigger, getByTestId, queryByTestId, user, content };
}

describe("Select", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(SelectTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("opens on click", async () => {
		await open();
	});

	it("opens on enter keydown", async () => {
		await open({}, kbd.ENTER);
	});

	it("opens on space keydown", async () => {
		await open({}, kbd.SPACE);
	});

	it("opens on arrow down keydown", async () => {
		await open({}, kbd.ARROW_DOWN);
	});

	it("opens on arrow up keydown", async () => {
		await open({}, kbd.ARROW_UP);
	});

	it("closes on escape keydown", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes on outside click", async () => {
		const { user, queryByTestId, getByTestId } = await open();
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).toBeNull();
	});

	it("portals to the body by default", async () => {
		const { content } = await open();
		expect(content.parentElement).toBe(document.body);
	});

	it("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portal: "#portal-target" });
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement).toBe(portalTarget);
	});

	it("does not portal if `null` is passed as portal prop", async () => {
		const { content, getByTestId } = await open({ portal: null });
		const main = getByTestId("main");
		expect(content.parentElement).toBe(main);
	});

	it.skip("respects the `closeOnEscape` prop", async () => {
		// Unskip once this is merged: https://github.com/melt-ui/melt-ui/pull/676
		const { user, queryByTestId } = await open({ closeOnEscape: false });
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it('respects the "closeOnOutsideClick" prop', async () => {
		const { user, queryByTestId, getByTestId } = await open({
			closeOnOutsideClick: false
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("respects binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({ closeOnOutsideClick: false });
		const binding = getByTestId("open-binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});
});
