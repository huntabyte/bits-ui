import { it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import BitsConfigTest from "./bits-config-test.svelte";
import { page } from "@vitest/browser/context";

it("should show undefined values when no config is set", async () => {
	render(BitsConfigTest);

	const noConfigPortal = page.getByTestId("no-config-portal");
	const noConfigLocale = page.getByTestId("no-config-locale");
	await expect.element(noConfigPortal).toHaveTextContent("undefined");
	await expect.element(noConfigLocale).toHaveTextContent("undefined");
});

it("should show configured values at root level", async () => {
	render(BitsConfigTest);

	const rootConfigPortal = page.getByTestId("root-config-portal");
	const rootConfigLocale = page.getByTestId("root-config-locale");

	await expect.element(rootConfigPortal).toHaveTextContent("#root-portal");
	await expect.element(rootConfigLocale).toHaveTextContent("en");
});

it("should inherit values from parent when child doesn't specify them", async () => {
	render(BitsConfigTest);

	const childInheritsPortal = page.getByTestId("child-inherits-portal");
	const childInheritsLocale = page.getByTestId("child-inherits-locale");

	await expect.element(childInheritsPortal).toHaveTextContent("#parent-portal");
	await expect.element(childInheritsLocale).toHaveTextContent("en");
});

it("should allow child to override parent values", async () => {
	render(BitsConfigTest);

	const childOverridesPortal = page.getByTestId("child-overrides-portal");
	const childOverridesLocale = page.getByTestId("child-overrides-locale");

	// child overrides portal but inherits locale
	await expect.element(childOverridesPortal).toHaveTextContent("#child-portal");
	await expect.element(childOverridesLocale).toHaveTextContent("en");
});

it("should handle deep nesting inheritance correctly", async () => {
	render(BitsConfigTest);

	const deepNestingPortal = page.getByTestId("deep-nesting-portal");
	const deepNestingLocale = page.getByTestId("deep-nesting-locale");

	// inherits portal from level 1, locale from level 2
	await expect.element(deepNestingPortal).toHaveTextContent("#level1");
	await expect.element(deepNestingLocale).toHaveTextContent("es");
});

it("should handle partial override chains correctly", async () => {
	render(BitsConfigTest);

	const partialOverridePortal = page.getByTestId("partial-override-portal");
	const partialOverrideLocale = page.getByTestId("partial-override-locale");

	// level 3 overrides portal, level 2 overrides locale
	await expect.element(partialOverridePortal).toHaveTextContent("#override");
	await expect.element(partialOverrideLocale).toHaveTextContent("fr");
});
