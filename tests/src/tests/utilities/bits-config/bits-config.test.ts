import { it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import BitsConfigTest from "./bits-config-test.svelte";

it("should render test component without errors", () => {
	const { container } = render(BitsConfigTest);
	expect(container).toBeTruthy();
});

it("should show undefined values when no config is set", () => {
	const { getByTestId } = render(BitsConfigTest);

	const noConfigPortal = getByTestId("no-config-portal");
	const noConfigLocale = getByTestId("no-config-locale");

	expect(noConfigPortal.textContent).toBe("undefined");
	expect(noConfigLocale.textContent).toBe("undefined");
});

it("should show configured values at root level", () => {
	const { getByTestId } = render(BitsConfigTest);

	const rootConfigPortal = getByTestId("root-config-portal");
	const rootConfigLocale = getByTestId("root-config-locale");

	expect(rootConfigPortal.textContent).toBe("#root-portal");
	expect(rootConfigLocale.textContent).toBe("en");
});

it("should inherit values from parent when child doesn't specify them", () => {
	const { getByTestId } = render(BitsConfigTest);

	const childInheritsPortal = getByTestId("child-inherits-portal");
	const childInheritsLocale = getByTestId("child-inherits-locale");

	expect(childInheritsPortal.textContent).toBe("#parent-portal");
	expect(childInheritsLocale.textContent).toBe("en");
});

it("should allow child to override parent values", () => {
	const { getByTestId } = render(BitsConfigTest);

	const childOverridesPortal = getByTestId("child-overrides-portal");
	const childOverridesLocale = getByTestId("child-overrides-locale");

	// child overrides portal but inherits locale
	expect(childOverridesPortal.textContent).toBe("#child-portal");
	expect(childOverridesLocale.textContent).toBe("en");
});

it("should handle deep nesting inheritance correctly", () => {
	const { getByTestId } = render(BitsConfigTest);

	const deepNestingPortal = getByTestId("deep-nesting-portal");
	const deepNestingLocale = getByTestId("deep-nesting-locale");

	// inherits portal from level 1, locale from level 2
	expect(deepNestingPortal.textContent).toBe("#level1");
	expect(deepNestingLocale.textContent).toBe("es");
});

it("should handle partial override chains correctly", () => {
	const { getByTestId } = render(BitsConfigTest);

	const partialOverridePortal = getByTestId("partial-override-portal");
	const partialOverrideLocale = getByTestId("partial-override-locale");

	// level 3 overrides portal, level 2 overrides locale
	expect(partialOverridePortal.textContent).toBe("#override");
	expect(partialOverrideLocale.textContent).toBe("fr");
});
