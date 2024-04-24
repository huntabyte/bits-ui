import { kbd } from "./kbd.js";
import type { Direction, Orientation } from "$lib/shared/index.js";

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.SPACE, kbd.ENTER];

export function getNextKey(dir: Direction = "ltr", orientation: Orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
		vertical: kbd.ARROW_DOWN,
	}[orientation];
}

export function getPrevKey(dir: Direction = "ltr", orientation: Orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
		vertical: kbd.ARROW_UP,
	}[orientation];
}

export function getDirectionalKeys(
	dir: Direction = "ltr",
	orientation: Orientation = "horizontal"
) {
	if (!["ltr", "rtl"].includes(dir)) dir = "ltr";
	if (!["horizontal", "vertical"].includes(orientation)) orientation = "horizontal";
	return {
		nextKey: getNextKey(dir, orientation),
		prevKey: getPrevKey(dir, orientation),
	};
}
