import { expect, it, vi } from "vitest";
import { page } from "@vitest/browser/context";
import { render } from "vitest-browser-svelte";
import AlertDialogReplaceContentTest from "./alert-dialog-replace-content-test.svelte";

it.each(["connected", "removed", "replaced"] as const)(
	"handles delayed autofocus when the original content is %s",
	async (scenario) => {
		const originalSetTimeout = globalThis.setTimeout;
		let captureNextTimeout = false;
		let pendingFocus: (() => void) | undefined;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const timeoutSpy = vi
			.spyOn(globalThis, "setTimeout")
			.mockImplementation((fn, delay, ...args) => {
				if (captureNextTimeout && delay === 0 && typeof fn === "function") {
					captureNextTimeout = false;
					pendingFocus = () => fn(...args);
					timer = originalSetTimeout(() => {}, 60_000);
					return timer;
				}
				return originalSetTimeout(fn, delay, ...args);
			});
		const onOpenAutoFocus = vi.fn((event: Event) => {
			if (pendingFocus) event.preventDefault();
			else captureNextTimeout = true;
		});

		try {
			const rendered = render(AlertDialogReplaceContentTest, { onOpenAutoFocus });
			await expect.poll(() => pendingFocus).toBeTypeOf("function");
			if (!pendingFocus) throw new Error("Missing delayed autofocus callback");
			const originalContent = page.getByTestId("content").element() as HTMLElement;
			const focus = vi.spyOn(originalContent, "focus");

			if (scenario === "removed") await rendered.unmount();
			if (scenario === "replaced") {
				await rendered.rerender({ version: 1 });
				await expect.poll(() => onOpenAutoFocus.mock.calls.length).toBe(2);
			}

			pendingFocus();

			if (scenario === "connected") {
				expect(focus).toHaveBeenCalledOnce();
				expect(document.activeElement).toBe(originalContent);
			} else {
				expect(originalContent.isConnected).toBe(false);
				expect(focus).not.toHaveBeenCalled();
				if (scenario === "replaced") {
					expect(page.getByTestId("content").element()).not.toBe(originalContent);
					expect(document.activeElement).not.toBe(page.getByTestId("content").element());
				}
			}
		} finally {
			if (timer !== undefined) clearTimeout(timer);
			timeoutSpy.mockRestore();
			vi.restoreAllMocks();
		}
	}
);
