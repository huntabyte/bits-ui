import { describe, it, expect } from "vitest";
import {
	getDataOpenClosed,
	getDataChecked,
	getAriaDisabled,
	getAriaReadonly,
	getAriaExpanded,
	getDataDisabled,
	getAriaRequired,
	getAriaSelected,
	getAriaChecked,
	getAriaOrientation,
	getAriaHidden,
	getAriaInvalid,
	getDataOrientation,
	getDataInvalid,
	getDataRequired,
	getDataReadonly,
	getDataSelected,
	getDataUnavailable,
	getHidden,
	getDisabled,
	getAriaPressed,
	getRequired,
	createBitsAttrs,
	type BitsAttrsConfig,
} from "./attrs.js";

describe("Boolean to string attribute functions", () => {
	describe("getDataOpenClosed", () => {
		it("returns 'open' when condition is true", () => {
			expect(getDataOpenClosed(true)).toBe("open");
		});

		it("returns 'closed' when condition is false", () => {
			expect(getDataOpenClosed(false)).toBe("closed");
		});
	});

	describe("getDataChecked", () => {
		it("returns 'checked' when condition is true", () => {
			expect(getDataChecked(true)).toBe("checked");
		});

		it("returns 'unchecked' when condition is false", () => {
			expect(getDataChecked(false)).toBe("unchecked");
		});
	});

	describe("getAriaDisabled", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaDisabled(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaDisabled(false)).toBe("false");
		});
	});

	describe("getAriaReadonly", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaReadonly(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaReadonly(false)).toBe("false");
		});
	});

	describe("getAriaExpanded", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaExpanded(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaExpanded(false)).toBe("false");
		});
	});

	describe("getAriaRequired", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaRequired(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaRequired(false)).toBe("false");
		});
	});

	describe("getAriaSelected", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaSelected(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaSelected(false)).toBe("false");
		});
	});

	describe("getAriaPressed", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaPressed(true)).toBe("true");
		});

		it("returns 'false' when condition is false", () => {
			expect(getAriaPressed(false)).toBe("false");
		});
	});
});

describe("Boolean to empty string or undefined functions", () => {
	describe("getDataDisabled", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataDisabled(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataDisabled(false)).toBeUndefined();
		});
	});

	describe("getDataInvalid", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataInvalid(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataInvalid(false)).toBeUndefined();
		});
	});

	describe("getDataRequired", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataRequired(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataRequired(false)).toBeUndefined();
		});
	});

	describe("getDataReadonly", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataReadonly(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataReadonly(false)).toBeUndefined();
		});
	});

	describe("getDataSelected", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataSelected(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataSelected(false)).toBeUndefined();
		});
	});

	describe("getDataUnavailable", () => {
		it("returns empty string when condition is true", () => {
			expect(getDataUnavailable(true)).toBe("");
		});

		it("returns undefined when condition is false", () => {
			expect(getDataUnavailable(false)).toBeUndefined();
		});
	});
});

describe("Boolean to true or undefined functions", () => {
	describe("getHidden", () => {
		it("returns true when condition is true", () => {
			expect(getHidden(true)).toBe(true);
		});

		it("returns undefined when condition is false", () => {
			expect(getHidden(false)).toBeUndefined();
		});
	});

	describe("getDisabled", () => {
		it("returns true when condition is true", () => {
			expect(getDisabled(true)).toBe(true);
		});

		it("returns undefined when condition is false", () => {
			expect(getDisabled(false)).toBeUndefined();
		});
	});

	describe("getRequired", () => {
		it("returns true when condition is true", () => {
			expect(getRequired(true)).toBe(true);
		});

		it("returns undefined when condition is false", () => {
			expect(getRequired(false)).toBeUndefined();
		});
	});
});

describe("Boolean to 'true' or undefined functions", () => {
	describe("getAriaHidden", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaHidden(true)).toBe("true");
		});

		it("returns undefined when condition is false", () => {
			expect(getAriaHidden(false)).toBeUndefined();
		});
	});

	describe("getAriaInvalid", () => {
		it("returns 'true' when condition is true", () => {
			expect(getAriaInvalid(true)).toBe("true");
		});

		it("returns undefined when condition is false", () => {
			expect(getAriaInvalid(false)).toBeUndefined();
		});
	});
});

describe("Special case functions", () => {
	describe("getAriaChecked", () => {
		it("returns 'mixed' when indeterminate is true", () => {
			expect(getAriaChecked(true, true)).toBe("mixed");
			expect(getAriaChecked(false, true)).toBe("mixed");
		});

		it("returns 'true' when checked is true and indeterminate is false", () => {
			expect(getAriaChecked(true, false)).toBe("true");
		});

		it("returns 'false' when checked is false and indeterminate is false", () => {
			expect(getAriaChecked(false, false)).toBe("false");
		});
	});

	describe("getAriaOrientation", () => {
		it("returns 'horizontal' when orientation is horizontal", () => {
			expect(getAriaOrientation("horizontal")).toBe("horizontal");
		});

		it("returns 'vertical' when orientation is vertical", () => {
			expect(getAriaOrientation("vertical")).toBe("vertical");
		});
	});

	describe("getDataOrientation", () => {
		it("returns 'horizontal' when orientation is horizontal", () => {
			expect(getDataOrientation("horizontal")).toBe("horizontal");
		});

		it("returns 'vertical' when orientation is vertical", () => {
			expect(getDataOrientation("vertical")).toBe("vertical");
		});
	});
});

describe("createBitsAttrs", () => {
	it("creates attrs object with component prefix when no variant", () => {
		const config: BitsAttrsConfig<["root", "trigger", "content"]> = {
			component: "dialog",
			parts: ["root", "trigger", "content"],
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.root).toBe("data-dialog-root");
		expect(attrs.trigger).toBe("data-dialog-trigger");
		expect(attrs.content).toBe("data-dialog-content");
	});

	it("creates attrs object with variant prefix when variant is provided", () => {
		const config: BitsAttrsConfig<["root", "trigger"]> = {
			component: "dialog",
			parts: ["root", "trigger"],
			getVariant: () => "mobile",
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.root).toBe("data-mobile-root");
		expect(attrs.trigger).toBe("data-mobile-trigger");
	});

	it("creates attrs object with component prefix when variant returns null", () => {
		const config: BitsAttrsConfig<["root"]> = {
			component: "dialog",
			parts: ["root"],
			getVariant: () => null,
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.root).toBe("data-dialog-root");
	});

	it("provides selector function that wraps attr in brackets", () => {
		const config: BitsAttrsConfig<["root", "trigger"]> = {
			component: "dialog",
			parts: ["root", "trigger"],
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.selector("root")).toBe("[data-dialog-root]");
		expect(attrs.selector("trigger")).toBe("[data-dialog-trigger]");
	});

	it("provides getAttr function that returns the attribute name", () => {
		const config: BitsAttrsConfig<["root", "trigger"]> = {
			component: "dialog",
			parts: ["root", "trigger"],
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.getAttr("root")).toBe("data-dialog-root");
		expect(attrs.getAttr("trigger")).toBe("data-dialog-trigger");
	});

	it("works with single part", () => {
		const config: BitsAttrsConfig<["root"]> = {
			component: "button",
			parts: ["root"],
		};

		const attrs = createBitsAttrs(config);

		expect(attrs.root).toBe("data-button-root");
		expect(attrs.selector("root")).toBe("[data-button-root]");
		expect(attrs.getAttr("root")).toBe("data-button-root");
	});

	it("handles empty parts array", () => {
		const config: BitsAttrsConfig<[]> = {
			component: "empty",
			parts: [],
		};

		const attrs = createBitsAttrs(config);

		expect(typeof attrs.selector).toBe("function");
		expect(typeof attrs.getAttr).toBe("function");
	});
});
