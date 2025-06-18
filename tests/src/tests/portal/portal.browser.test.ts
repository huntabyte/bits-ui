import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import PortalTest from "./portal-test.svelte";
import { page } from "@vitest/browser/context";
import { expectNotExists } from "../browser-utils";

it("should portal content to document.body by default", async () => {
	render(PortalTest);
	await tick();

	const content = page.getByTestId("portal-content").element();
	expect(content).toBeInTheDocument();
	expect(content.parentElement).toBe(document.body);
});

it("should display the portal content", async () => {
	render(PortalTest, { content: "Test content" });
	await tick();

	const content = page.getByTestId("portal-content").element();
	expect(content).toHaveTextContent("Test content");
});

it("should portal to element by ID selector", async () => {
	render(PortalTest, { to: "#string-target" });
	await tick();

	const content = page.getByTestId("portal-content").element();
	const target = page.getByTestId("string-target").element();
	expect(content.parentElement).toBe(target);
});

it("should portal to element by class selector", async () => {
	render(PortalTest, { to: ".class-target" });
	await tick();

	const content = page.getByTestId("portal-content").element();
	const target = page.getByTestId("class-target").element();
	expect(content.parentElement).toBe(target);
});

it("should portal to element by attribute selector", async () => {
	render(PortalTest, { to: '[data-testid="custom-target"]' });
	await tick();

	const content = page.getByTestId("portal-content").element();
	const target = page.getByTestId("custom-target").element();
	expect(content.parentElement).toBe(target);
});

it("should portal to HTMLElement target", async () => {
	const targetElement = document.createElement("div");
	targetElement.setAttribute("data-testid", "dynamic-target");
	document.body.appendChild(targetElement);

	render(PortalTest, { to: targetElement, includeTargets: false });
	await tick();

	const content = page.getByTestId("portal-content").element();
	expect(content.parentElement).toBe(targetElement);

	document.body.removeChild(targetElement);
});

it("should portal to DocumentFragment target", async () => {
	const fragment = document.createDocumentFragment();
	const container = document.createElement("div");
	container.setAttribute("data-testid", "fragment-container");
	fragment.appendChild(container);

	const host = document.createElement("div");
	host.setAttribute("data-testid", "fragment-host");
	document.body.appendChild(host);
	host.appendChild(fragment);

	render(PortalTest, { to: container, includeTargets: false });
	await tick();

	const content = page.getByTestId("portal-content").element();
	expect(content.parentElement).toBe(container);

	document.body.removeChild(host);
});

it("should render inline when disabled", async () => {
	render(PortalTest, { disabled: true });
	await tick();

	const content = page.getByTestId("portal-content").element();
	const mainContainer = page.getByTestId("main-container").element();

	expect(mainContainer.contains(content)).toBe(true);
	expect(content.parentElement).not.toBe(document.body);
});

it("should not portal when disabled even with target", async () => {
	render(PortalTest, { to: "#string-target", disabled: true });
	await tick();

	const content = page.getByTestId("portal-content").element();
	const target = page.getByTestId("string-target").element();
	const mainContainer = page.getByTestId("main-container").element();

	expect(content.parentElement).not.toBe(target);
	expect(mainContainer.contains(content)).toBe(true);
});

it("should clean up portal content when component unmounts", async () => {
	const { unmount } = render(PortalTest, { content: "Cleanup test" });
	await tick();

	let content = page.getByTestId("portal-content").element();
	expect(content).toBeInTheDocument();

	unmount();
	await tick();

	await expectNotExists(page.getByTestId("portal-content"));
});

it("should handle multiple portals to different targets", async () => {
	render(PortalTest, { to: "#string-target", content: "First portal" });
	render(PortalTest, {
		to: ".class-target",
		content: "Second portal",
		includeTargets: false,
	});
	await tick();

	const contents = page.getByTestId("portal-content").all();

	expect(contents).toHaveLength(2);

	const stringTarget = page.getByTestId("string-target").element();
	const classTarget = page.getByTestId("class-target").element();

	const firstContent = contents.find((el) => el.element().textContent === "First portal");
	const secondContent = contents.find((el) => el.element().textContent === "Second portal");

	if (!firstContent || !secondContent) {
		throw new Error("Could not find portal contents");
	}

	expect(firstContent.element().parentElement).toBe(stringTarget);
	expect(secondContent.element().parentElement).toBe(classTarget);
});
