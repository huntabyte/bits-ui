import { describe, expect, it } from "vitest";
import { cssToStyleObj } from "./cssToStyleObj.js";

describe("cssToStyleObj", () => {
	it("should return an empty object if an empty string is passed", () => {
		const result = cssToStyleObj("");
		expect(result).toEqual({});
	});

	it("should return an empty object if null is passed", () => {
		const result = cssToStyleObj(null);
		expect(result).toEqual({});
	});

	it("should return an empty object if undefined is passed", () => {
		const result = cssToStyleObj(undefined);
		expect(result).toEqual({});
	});

	it("should convert a single CSS property to camelCase in the style object", () => {
		const result = cssToStyleObj("background-color: red;");
		expect(result).toEqual({ backgroundColor: "red" });
	});

	it("should convert multiple CSS properties to camelCase in the style object", () => {
		const result = cssToStyleObj("color: blue; font-size: 16px; margin-top: 10px;");
		expect(result).toEqual({ color: "blue", fontSize: "16px", marginTop: "10px" });
	});

	it("should handle CSS shorthand properties correctly", () => {
		const result = cssToStyleObj("margin: 10px 20px 30px 40px;");
		expect(result).toEqual({ margin: "10px 20px 30px 40px" });
	});

	it("should handle CSS comments correctly", () => {
		const result = cssToStyleObj("/* comment */ color: green; /* another comment */");
		expect(result).toEqual({ color: "green" });
	});

	it("should handle CSS vendor prefixes correctly", () => {
		const result = cssToStyleObj(
			"-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg);"
		);
		expect(result).toEqual({ WebkitTransform: "rotate(45deg)", MozTransform: "rotate(45deg)" });
	});
});
