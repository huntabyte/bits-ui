import { expect, it, vi } from "vitest";
import { page, userEvent } from "@vitest/browser/context";
import { render } from "vitest-browser-svelte";
import DialogTest from "./dialog-test.svelte";
import DropdownMenuTest from "../dropdown-menu/dropdown-menu-test.svelte";

it.each(["dialog", "dropdown menu"] as const)(
	"reports open and close completion when %s content mounts on demand",
	async (component) => {
		const onOpenChangeComplete = vi.fn();
		if (component === "dialog") render(DialogTest, { onOpenChangeComplete });
		else render(DropdownMenuTest, { onOpenChangeComplete });

		await expect.element(page.getByTestId("content")).not.toBeInTheDocument();
		await page.getByTestId("trigger").click();
		await expect.poll(() => onOpenChangeComplete.mock.calls).toEqual([[true]]);

		await userEvent.keyboard("{Escape}");
		await expect.poll(() => onOpenChangeComplete.mock.calls).toEqual([[true], [false]]);
		await expect.element(page.getByTestId("content")).not.toBeInTheDocument();
	}
);
