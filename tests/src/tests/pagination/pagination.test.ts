import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { setupUserEvents } from "../utils.js";
import PaginationTest, { type PaginationTestProps } from "./pagination-test.svelte";

function setup(props: PaginationTestProps = { count: 100 }) {
	const user = setupUserEvents();
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
		...returned,
	};
}

function getPageButton(el: HTMLElement, page: number) {
	const btn = el.querySelector(`[data-value="${page}"]`);
	if (!(btn instanceof HTMLElement)) {
		throw new TypeError(`Page button ${page} not found`);
	}
	return btn;
}

function getValue(el: HTMLElement) {
	return el.querySelector("[data-selected]")?.getAttribute("data-value");
}

it("should have no  accessibility violations", async () => {
	const { container } = render(PaginationTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should navigate previous and Next button accordingly", async () => {
	const t = setup();

	expect(getValue(t.root)).toBe("1");
	await t.user.click(t.prev);
	expect(getValue(t.root)).toBe("1");
	await t.user.click(t.next);
	expect(getValue(t.root)).toBe("2");
	await t.user.click(t.next);
	expect(getValue(t.root)).toBe("3");
	await t.user.click(t.prev);
	expect(getValue(t.root)).toBe("2");
});

it("should change on clicked button", async () => {
	const t = setup();
	const page2 = getPageButton(t.root, 2);
	expect(getValue(t.root)).toBe("1");
	await t.user.click(page2);
	expect(getValue(t.root)).toBe("2");

	const page10 = getPageButton(t.root, 10);
	await t.user.click(page10);
	expect(getValue(t.root)).toBe("10");
});

it("should display the correct range of items being displayed", async () => {
	const t = setup();
	expect(t.getByTestId("range-start")).toHaveTextContent("1");
	expect(t.getByTestId("range-end")).toHaveTextContent("10");
	await t.user.click(t.next);
	expect(t.getByTestId("range-start")).toHaveTextContent("11");
	expect(t.getByTestId("range-end")).toHaveTextContent("20");
});
