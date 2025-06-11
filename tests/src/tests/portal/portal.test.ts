import { render, screen } from "@testing-library/svelte/svelte5";
import { it, expect } from "vitest";
import { tick } from "svelte";
import PortalTest from "./portal-test.svelte";

type PortalTarget = Element | string;

it("should portal content to document.body by default", async () => {
	render(PortalTest);
	await tick();

	const content = screen.getByTestId("portal-content");
	expect(content).toBeInTheDocument();
	expect(content.parentElement).toBe(document.body);
});

it("should display the portal content", async () => {
	render(PortalTest, { content: "Test content" });
	await tick();

	const content = screen.getByTestId("portal-content");
	expect(content).toHaveTextContent("Test content");
});

it("should portal to element by ID selector", async () => {
	render(PortalTest, { to: "#string-target" });
	await tick();

	const content = screen.getByTestId("portal-content");
	const target = screen.getByTestId("string-target");
	expect(content.parentElement).toBe(target);
});

it("should portal to element by class selector", async () => {
	render(PortalTest, { to: ".class-target" });
	await tick();

	const content = screen.getByTestId("portal-content");
	const target = screen.getByTestId("class-target");
	expect(content.parentElement).toBe(target);
});

it("should portal to element by attribute selector", async () => {
	render(PortalTest, { to: '[data-testid="custom-target"]' });
	await tick();

	const content = screen.getByTestId("portal-content");
	const target = screen.getByTestId("custom-target");
	expect(content.parentElement).toBe(target);
});

it("should throw error for invalid selector in development", async () => {
	process.env.NODE_ENV = "development";

	expect(() => {
		render(PortalTest, { to: "#nonexistent-target" });
	}).toThrow('Target element "#nonexistent-target" not found.');
});

it("should portal to HTMLElement target", async () => {
	const targetElement = document.createElement("div");
	targetElement.setAttribute("data-testid", "dynamic-target");
	document.body.appendChild(targetElement);

	render(PortalTest, { to: targetElement, includeTargets: false });
	await tick();

	const content = screen.getByTestId("portal-content");
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

	const content = screen.getByTestId("portal-content");
	expect(content.parentElement).toBe(container);

	document.body.removeChild(host);
});

it("should render inline when disabled", async () => {
	render(PortalTest, { disabled: true });
	await tick();

	const content = screen.getByTestId("portal-content");
	const mainContainer = screen.getByTestId("main-container");

	expect(mainContainer.contains(content)).toBe(true);
	expect(content.parentElement).not.toBe(document.body);
});

it("should not portal when disabled even with target", async () => {
	render(PortalTest, { to: "#string-target", disabled: true });
	await tick();

	const content = screen.getByTestId("portal-content");
	const target = screen.getByTestId("string-target");
	const mainContainer = screen.getByTestId("main-container");

	expect(content.parentElement).not.toBe(target);
	expect(mainContainer.contains(content)).toBe(true);
});

it("should throw TypeError for invalid target type in development", async () => {
	process.env.NODE_ENV = "development";

	expect(() => {
		render(PortalTest, { to: 123 as unknown as PortalTarget });
	}).toThrow(/Unknown portal target type/);
});

it("should throw TypeError for null target in development", async () => {
	process.env.NODE_ENV = "development";

	expect(() => {
		render(PortalTest, { to: null as unknown as PortalTarget });
	}).toThrow("Unknown portal target type: null");
});

it("should clean up portal content when component unmounts", async () => {
	const { unmount } = render(PortalTest, { content: "Cleanup test" });
	await tick();

	let content = screen.queryByTestId("portal-content");
	expect(content).toBeInTheDocument();

	unmount();
	await tick();

	content = screen.queryByTestId("portal-content");
	expect(content).not.toBeInTheDocument();
});

it("should handle multiple portals to different targets", async () => {
	render(PortalTest, { to: "#string-target", content: "First portal" });
	render(PortalTest, {
		to: ".class-target",
		content: "Second portal",
		includeTargets: false,
	});
	await tick();

	const contents = screen.getAllByTestId("portal-content");
	expect(contents).toHaveLength(2);

	const stringTarget = screen.getByTestId("string-target");
	const classTarget = screen.getByTestId("class-target");

	const firstContent = contents.find((el) => el.textContent === "First portal");
	const secondContent = contents.find((el) => el.textContent === "Second portal");

	if (!firstContent || !secondContent) {
		throw new Error("Could not find portal contents");
	}

	expect(firstContent.parentElement).toBe(stringTarget);
	expect(secondContent.parentElement).toBe(classTarget);
});
