import "@testing-library/svelte/vitest";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";
import type { Navigation, Page } from "@sveltejs/kit";
import { readable } from "svelte/store";
import { toHaveNoViolations } from "jest-axe";
import { configure } from "@testing-library/dom";
import type * as environment from "$app/environment";
import type * as navigation from "$app/navigation";
import type * as stores from "$app/stores";

expect.extend(matchers);

expect.extend(toHaveNoViolations as never);

configure({
	asyncUtilTimeout: 1500,
});

// Mock SvelteKit runtime module $app/environment
vi.mock("$app/environment", (): typeof environment => ({
	browser: false,
	dev: true,
	building: false,
	version: "any",
}));

// Mock SvelteKit runtime module $app/navigation
vi.mock("$app/navigation", (): typeof navigation => ({
	afterNavigate: () => {},
	beforeNavigate: () => {},
	disableScrollHandling: () => {},
	goto: () => Promise.resolve(),
	invalidate: () => Promise.resolve(),
	invalidateAll: () => Promise.resolve(),
	preloadData: () => Promise.resolve({ type: "loaded" as const, status: 200, data: {} }),
	preloadCode: () => Promise.resolve(),
	onNavigate: () => {},
	pushState: () => {},
	replaceState: () => {},
}));

// Mock SvelteKit runtime module $app/stores
vi.mock("$app/stores", (): typeof stores => {
	const getStores: typeof stores.getStores = () => {
		const navigating = readable<Navigation | null>(null);
		const page = readable<Page>({
			url: new URL("http://localhost"),
			params: {},
			route: {
				id: null,
			},
			status: 200,
			error: null,
			data: {},
			form: undefined,
			state: {},
		});
		const updated = { subscribe: readable(false).subscribe, check: async () => false };

		return { navigating, page, updated };
	};

	const page: typeof stores.page = {
		subscribe(fn) {
			return getStores().page.subscribe(fn);
		},
	};
	const navigating: typeof stores.navigating = {
		subscribe(fn) {
			return getStores().navigating.subscribe(fn);
		},
	};
	const updated: typeof stores.updated = {
		subscribe(fn) {
			return getStores().updated.subscribe(fn);
		},
		check: async () => false,
	};

	return {
		getStores,
		navigating,
		page,
		updated,
	};
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
globalThis.ResizeObserver = require("resize-observer-polyfill");
Element.prototype.scrollIntoView = () => {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Element.prototype.hasPointerCapture = (() => {}) as any;

// @ts-expect-error - shut it
globalThis.window.CSS.supports = (_property: string, _value: string) => true;

globalThis.document.elementsFromPoint = () => [];
globalThis.document.elementFromPoint = () => null;

class PointerEvent extends MouseEvent {
	public isPrimary: boolean;
	public pointerId: number;
	public pointerType: string;
	public height: number;
	public width: number;
	public tiltX: number;
	public tiltY: number;
	public twist: number;
	public pressure: number;
	public tangentialPressure: number;

	constructor(type: string, params: PointerEventInit = {}) {
		super(type, params);

		// Using defaults from W3C specs:
		// https://w3c.github.io/pointerevents/#pointerevent-interface
		this.isPrimary = params.isPrimary ?? false;
		this.pointerId = params.pointerId ?? 0;
		this.pointerType = params.pointerType ?? "";
		this.width = params.width ?? 1;
		this.height = params.height ?? 1;
		this.tiltX = params.tiltX ?? 0;
		this.tiltY = params.tiltY ?? 0;
		this.twist = params.twist ?? 0;
		this.pressure = params.pressure ?? 0;
		this.tangentialPressure = params.tangentialPressure ?? 0;
	}
}

global.PointerEvent = global.PointerEvent ?? (PointerEvent as typeof globalThis.PointerEvent);
