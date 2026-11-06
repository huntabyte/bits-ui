import { it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import BitsConfigTest from "./bits-config-test.svelte";
import { page } from "vitest/browser";

it("should show undefined values when no config is set", async () => {
	await render(BitsConfigTest);

	const noConfigPortal = page.getByTestId("no-config-portal");
	const noConfigLocale = page.getByTestId("no-config-locale");
	await expect.element(noConfigPortal).toMatchTextContent("undefined");
	await expect.element(noConfigLocale).toMatchTextContent("undefined");
});

it("should show configured values at root level", async () => {
	await render(BitsConfigTest);

	const rootConfigPortal = page.getByTestId("root-config-portal");
	const rootConfigLocale = page.getByTestId("root-config-locale");

	await expect.element(rootConfigPortal).toMatchTextContent("#root-portal");
	await expect.element(rootConfigLocale).toMatchTextContent("en");
});

it("should inherit values from parent when child doesn't specify them", async () => {
	await render(BitsConfigTest);

	const childInheritsPortal = page.getByTestId("child-inherits-portal");
	const childInheritsLocale = page.getByTestId("child-inherits-locale");

	await expect.element(childInheritsPortal).toMatchTextContent("#parent-portal");
	await expect.element(childInheritsLocale).toMatchTextContent("en");
});

it("should allow child to override parent values", async () => {
	await render(BitsConfigTest);

	const childOverridesPortal = page.getByTestId("child-overrides-portal");
	const childOverridesLocale = page.getByTestId("child-overrides-locale");

	// child overrides portal but inherits locale
	await expect.element(childOverridesPortal).toMatchTextContent("#child-portal");
	await expect.element(childOverridesLocale).toMatchTextContent("en");
});

it("should handle deep nesting inheritance correctly", async () => {
	await render(BitsConfigTest);

	const deepNestingPortal = page.getByTestId("deep-nesting-portal");
	const deepNestingLocale = page.getByTestId("deep-nesting-locale");

	// inherits portal from level 1, locale from level 2
	await expect.element(deepNestingPortal).toMatchTextContent("#level1");
	await expect.element(deepNestingLocale).toMatchTextContent("es");
});

it("should handle partial override chains correctly", async () => {
	await render(BitsConfigTest);

	const partialOverridePortal = page.getByTestId("partial-override-portal");
	const partialOverrideLocale = page.getByTestId("partial-override-locale");

	// level 3 overrides portal, level 2 overrides locale
	await expect.element(partialOverridePortal).toMatchTextContent("#override");
	await expect.element(partialOverrideLocale).toMatchTextContent("fr");
});
