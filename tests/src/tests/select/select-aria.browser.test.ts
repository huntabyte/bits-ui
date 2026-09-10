import { expect, it } from "vitest";
import { page, userEvent } from "@vitest/browser/context";
import { render } from "vitest-browser-svelte";
import SelectTest from "./select-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";

it.each(["single", "multiple"] as const)(
	"exposes the %s select as a combobox controlling its listbox",
	async (type) => {
		const props = {
			items: [{ value: "apple", label: "Apple" }],
			contentProps: { id: "fruit-options" },
		};
		if (type === "single") render(SelectTest, { ...props, type });
		else render(SelectMultiTest, { ...props, type });

		const trigger = page.getByTestId("trigger");
		await expect.element(trigger).toHaveRole("combobox");
		await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
		await expect.element(trigger).not.toHaveAttribute("aria-controls");

		await trigger.click();
		const content = page.getByRole("listbox");
		await expect.element(content).toHaveAttribute("id", "fruit-options");
		await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
		await expect.element(trigger).toHaveAttribute("aria-controls", "fruit-options");

		await userEvent.keyboard("{Escape}");
		await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
		await expect.element(content).not.toBeInTheDocument();
		await expect.element(trigger).not.toHaveAttribute("aria-controls");
	}
);
