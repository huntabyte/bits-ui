import "@testing-library/svelte/vitest";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";
import { configure } from "@testing-library/dom";

expect.extend(matchers);

expect.extend(toHaveNoViolations as never);

configure({
	asyncUtilTimeout: 1500,
});

// oxlint-disable-next-line no-require-imports
globalThis.ResizeObserver = require("resize-observer-polyfill");
Element.prototype.scrollIntoView = () => {};
// oxlint-disable-next-line no-explicit-any
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
