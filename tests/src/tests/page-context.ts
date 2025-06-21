import { locators } from "@vitest/browser/context";

locators.extend({
	getHiddenInputs(name: string) {
		return `input[name='${name}']`;
	},
});

// if you are using typescript, you can extend LocatorSelectors interface
// to have the autocompletion in locators.extend, page.* and locator.* methods
declare module "@vitest/browser/context" {
	interface LocatorSelectors {
		getHiddenInputs(title: string): Locator;
	}
	interface Locator {
		query(): HTMLElement | null;
		element(): HTMLElement;
	}
}
