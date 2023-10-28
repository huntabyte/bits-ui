import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import DropdownMenuTest from "./DropdownMenuTest.svelte";
import { testKbd as kbd } from "../utils.js";
import { sleep } from "$lib/internal";

describe("Dialog", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(DropdownMenuTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(DropdownMenuTest, { open: true });
		const parts = ["trigger", "overlay", "portal", "close", "title", "description", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-bits-dialog-${part}`);
		}
	});
});
