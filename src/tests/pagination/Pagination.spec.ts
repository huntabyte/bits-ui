import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type { Pagination } from "$lib";
import PaginationTest from "./PaginationTest.svelte";

function setup(props: Pagination.Props = { count: 100}) {
	const user = userEvent.setup();
	const returned = render(PaginationTest, { ...props });

	const root = returned.getByTestId("root");
	const range = returned.getByTestId("range");
	const prev = returned.getByTestId("prev-button");
	const next = returned.getByTestId("next-button");

	return {
		root,
		range,
		prev,
		next,
		user,
		...returned
	};
}

function getValue(el: HTMLElement) {
	return el.querySelector("[data-selected]")?.getAttribute("data-value");
}

describe("Pagination", () => {
	test("No accessibility violations", async () => {
		const { container } = render(PaginationTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test("Previous and Next button should work accordingly", async () => {
		const { root, prev, next } = setup();

		await expect(getValue(root)).toBe("1");
		await prev.click();
		await expect(getValue(root)).toBe("1");
		await next.click();
		await expect(getValue(root)).toBe("2");
		await next.click();
		await expect(getValue(root)).toBe("3");
		await prev.click();
		await expect(getValue(root)).toBe("2");
	});

	// TODO: write more tests
	test.todo("Should change on clicked button");
});
