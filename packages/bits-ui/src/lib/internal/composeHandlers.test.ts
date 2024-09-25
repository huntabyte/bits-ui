import { describe, expect, it, vi } from "vitest";
import { composeHandlers } from "./composeHandlers.js"; // Replace with the actual file name

describe("composeHandlers", () => {
	it("should call all handlers in order", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const composedHandler = composeHandlers(handler1, handler2);
		const event = new MouseEvent("click", { cancelable: true });

		composedHandler(event);

		expect(handler1).toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});

	it("should stop calling handlers if event.preventDefault() is called", () => {
		const handler1 = vi.fn((e: Event) => e.preventDefault());
		const handler2 = vi.fn();
		const composedHandler = composeHandlers(handler1, handler2);
		const event = new Event("click", { cancelable: true });

		composedHandler(event);

		expect(handler1).toHaveBeenCalledWith(event);
		expect(handler2).not.toHaveBeenCalled();
	});

	it("should handle undefined handlers", () => {
		const handler1 = vi.fn();
		const handler2 = undefined;
		const handler3 = vi.fn();
		const composedHandler = composeHandlers(handler1, handler2, handler3);
		const event = new Event("click", { cancelable: true });

		composedHandler(event);

		expect(handler1).toHaveBeenCalledWith(event);
		expect(handler3).toHaveBeenCalledWith(event);
	});

	it('should preserve "this" context', () => {
		const context = { name: "TestContext" };
		const handler = vi.fn(function (this: typeof context, e: Event) {
			expect(this).toBe(context);
		});
		const composedHandler = composeHandlers(handler);
		const event = new Event("click");

		composedHandler.call(context, event);

		expect(handler).toHaveBeenCalledWith(event);
	});
});
