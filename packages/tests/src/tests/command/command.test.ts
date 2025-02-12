import { computeCommandScore } from "bits-ui";

describe("computeCommandScore", () => {
	it("returns 1 for exact matches", () => {
		expect(computeCommandScore("test", "test")).toBe(1);
	});

	it("handles case insensitive matches", () => {
		expect(computeCommandScore("Test", "test")).toBeCloseTo(0.9999);
		expect(computeCommandScore("TEST", "test")).toBeCloseTo(0.9999);
	});

	it("scores prefix matches higher", () => {
		const prefixScore = computeCommandScore("test", "te");
		const middleScore = computeCommandScore("test", "es");
		expect(prefixScore).toBeGreaterThan(middleScore);
	});

	it("penalizes non-continuous matches", () => {
		const continuousScore = computeCommandScore("test", "te");
		const skipScore = computeCommandScore("test", "tt");
		expect(continuousScore).toBeGreaterThan(skipScore);
	});

	it("handles word boundaries in commands", () => {
		const spaceScore = computeCommandScore("copy paste", "cp");
		const slashScore = computeCommandScore("copy/paste", "cp");
		expect(spaceScore).toBeGreaterThan(slashScore);
	});

	it("considers keywords in scoring", () => {
		const score = computeCommandScore("Calculator", "add", ["math", "add", "subtract"]);
		expect(score).toBeGreaterThan(0);
	});

	it("handles transposed characters", () => {
		const correctScore = computeCommandScore("string", "st");
		const transposedScore = computeCommandScore("string", "ts");
		expect(correctScore).toBeGreaterThan(transposedScore);
		expect(transposedScore).toBeGreaterThan(0);
	});

	it("returns 0 for no matches", () => {
		expect(computeCommandScore("test", "xyz")).toBe(0);
	});

	it("handles special characters in commands", () => {
		expect(computeCommandScore("copy@paste", "cp")).toBeGreaterThan(0);
		expect(computeCommandScore("copy#paste", "cp")).toBeGreaterThan(0);
		expect(computeCommandScore("copy[paste]", "cp")).toBeGreaterThan(0);
	});

	it("handles empty inputs", () => {
		expect(computeCommandScore("", "")).toBe(1);
		expect(computeCommandScore("test", "")).toBe(0.99);
		expect(computeCommandScore("", "test")).toBe(0);
	});
});
