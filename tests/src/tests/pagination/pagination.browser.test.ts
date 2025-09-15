import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import PaginationTest, { type PaginationTestProps } from "./pagination-test.svelte";
import { page } from "@vitest/browser/context";

function setup(props: PaginationTestProps = { count: 100 }) {
	render(PaginationTest, { ...props });

	const root = page.getByTestId("root");
	const range = page.getByTestId("range");
	const prev = page.getByTestId("prev-button");
	const next = page.getByTestId("next-button");

	return {
		root,
		range,
		prev,
		next,
	};
}

it("should navigate previous and Next button accordingly", async () => {
	const t = setup();

	await expect.element(page.getByTestId("current-page")).toHaveTextContent("1");
	await t.prev.click({ force: true });
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("1");
	await t.next.click();
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("2");
	await t.next.click();
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("3");
	await t.prev.click();
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("2");
});

it("should change on clicked button", async () => {
	setup();
	const page2 = page.getByTestId("page-2");
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("1");
	await page2.click();
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("2");

	const page10 = page.getByTestId("page-10");
	await page10.click();
	await expect.element(page.getByTestId("current-page")).toHaveTextContent("10");
});

it("should display the correct range of items being displayed", async () => {
	const t = setup();
	await expect.element(page.getByTestId("range-start")).toHaveTextContent("1");
	await expect.element(page.getByTestId("range-end")).toHaveTextContent("10");
	await t.next.click();
	await expect.element(page.getByTestId("range-start")).toHaveTextContent("11");
	await expect.element(page.getByTestId("range-end")).toHaveTextContent("20");
});
