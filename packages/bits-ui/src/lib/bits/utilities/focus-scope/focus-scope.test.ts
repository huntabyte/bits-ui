import { afterEach, expect, it, vi } from "vitest";
import { boxWith } from "svelte-toolbelt";
import { FocusScope } from "./focus-scope.svelte.js";

let scope: FocusScope | undefined;

afterEach(() => {
	scope?.unmount();
	scope = undefined;
	document.body.replaceChildren();
});

it("preserves user focus and autofocus lifetime when mounting the same container again", () => {
	const trigger = document.createElement("button");
	const container = document.createElement("div");
	const search = document.createElement("input");
	const option = document.createElement("button");
	container.append(search, option);
	document.body.append(trigger, container);
	trigger.focus();

	const onOpenAutoFocus = vi.fn((event: Event) => {
		event.preventDefault();
		search.focus();
	});
	const onCloseAutoFocus = vi.fn();
	scope = new FocusScope({
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		trap: boxWith(() => true),
		loop: false,
	});

	scope.mount(container);
	expect(document.activeElement).toBe(search);
	option.focus();
	expect(document.activeElement).toBe(option);

	scope.mount(container);
	expect(document.activeElement).toBe(option);
	expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
	expect(onCloseAutoFocus).not.toHaveBeenCalled();

	scope.unmount();
	expect(document.activeElement).toBe(trigger);
	expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
});
