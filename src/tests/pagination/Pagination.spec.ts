// NOTE: these tests were shamelessly copied from melt-ui 🥲
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type { Pagination } from "$lib";
import PaginationTest from "./PaginationTest.svelte";
import { isHTMLElement } from "@melt-ui/svelte/internal/helpers";

function setup(props: Pagination.Props = { count: 100 }) {
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

function getPageButton(el: HTMLElement, page: number) {
	const btn = el.querySelector(`[data-value="${page}"]`);
	if (!isHTMLElement(btn)) {
		throw new Error(`Page button ${page} not found`);
	}
	return btn;
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

	test("Should change on clicked button", async () => {
		const { getByTestId } = await render(PaginationTest);

		const root = getByTestId("root");
		const page2 = getPageButton(root, 2);

		await expect(getValue(root)).toBe("1");
		await page2.click();
		await expect(getValue(root)).toBe("2");

		const page10 = getPageButton(root, 10);
		await page10.click();
		await expect(getValue(root)).toBe("10");
	});
});
