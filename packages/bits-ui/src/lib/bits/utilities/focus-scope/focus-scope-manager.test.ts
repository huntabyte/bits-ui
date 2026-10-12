import { describe, expect, it } from "vitest";
import { boxWith } from "svelte-toolbelt";
import { FocusScopeManager } from "./focus-scope-manager.js";
import { FocusScope } from "./focus-scope.svelte.js";

function createScope() {
	return new FocusScope({
		onOpenAutoFocus: boxWith(() => () => {}),
		onCloseAutoFocus: boxWith(() => () => {}),
		trap: boxWith(() => false),
		loop: false,
	});
}

describe("FocusScopeManager", () => {
	it("should resume a paused scope when it registers again", () => {
		const manager = new FocusScopeManager();
		const menu = createScope();
		const tooltip = createScope();

		manager.register(menu);
		manager.register(tooltip);
		manager.unregister(menu);
		manager.register(menu);

		expect(manager.isActiveScope(menu)).toBe(true);
		expect(menu.paused).toBe(false);
		expect(tooltip.paused).toBe(true);
	});
});
