import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import { page } from "@vitest/browser/context";
import { CommandRootState } from "../../../../packages/bits-ui/dist/bits/command/command.svelte.js";
import CommandTest from "./command-test.svelte";

it("does not run deferred root work after unmount", async () => {
	const create = vi.spyOn(CommandRootState, "create");
	// oxlint-disable-next-line no-explicit-any
	const view = render(CommandTest, {} as any);
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	const state = create.mock.results[0]?.value;
	if (!state) throw new Error("Missing Command root state");
	const opts = state.opts;
	const reads: PropertyKey[] = [];
	// oxlint-disable-next-line no-explicit-any
	(state as any).opts = new Proxy(opts, {
		get(target, key, receiver) {
			reads.push(key);
			return Reflect.get(target, key, receiver);
		},
	});
	try {
		const unmounted = view.unmount();
		reads.length = 0;
		await unmounted;
		await tick();
		expect(reads).toEqual([]);
	} finally {
		// oxlint-disable-next-line no-explicit-any
		(state as any).opts = opts;
		create.mockRestore();
	}
});
