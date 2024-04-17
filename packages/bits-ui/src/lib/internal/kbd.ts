import type { Orientation, TextDirection } from "$lib/shared/index.js";

export function getKbd() {
	return {
		ALT: "Alt",
		ARROW_DOWN: "ArrowDown",
		ARROW_LEFT: "ArrowLeft",
		ARROW_RIGHT: "ArrowRight",
		ARROW_UP: "ArrowUp",
		BACKSPACE: "Backspace",
		CAPS_LOCK: "CapsLock",
		CONTROL: "Control",
		DELETE: "Delete",
		END: "End",
		ENTER: "Enter",
		ESCAPE: "Escape",
		F1: "F1",
		F10: "F10",
		F11: "F11",
		F12: "F12",
		F2: "F2",
		F3: "F3",
		F4: "F4",
		F5: "F5",
		F6: "F6",
		F7: "F7",
		F8: "F8",
		F9: "F9",
		HOME: "Home",
		META: "Meta",
		PAGE_DOWN: "PageDown",
		PAGE_UP: "PageUp",
		SHIFT: "Shift",
		SPACE: " ",
		TAB: "Tab",
		CTRL: "Control",
		ASTERISK: "*",
	};
}

export const kbd = {
	ALT: "Alt",
	ARROW_DOWN: "ArrowDown",
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	ARROW_UP: "ArrowUp",
	BACKSPACE: "Backspace",
	CAPS_LOCK: "CapsLock",
	CONTROL: "Control",
	DELETE: "Delete",
	END: "End",
	ENTER: "Enter",
	ESCAPE: "Escape",
	F1: "F1",
	F10: "F10",
	F11: "F11",
	F12: "F12",
	F2: "F2",
	F3: "F3",
	F4: "F4",
	F5: "F5",
	F6: "F6",
	F7: "F7",
	F8: "F8",
	F9: "F9",
	HOME: "Home",
	META: "Meta",
	PAGE_DOWN: "PageDown",
	PAGE_UP: "PageUp",
	SHIFT: "Shift",
	SPACE: " ",
	TAB: "Tab",
	CTRL: "Control",
	ASTERISK: "*",
};

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.SPACE, kbd.ENTER];

export function getNextKey(dir: TextDirection = "ltr", orientation: Orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
		vertical: kbd.ARROW_DOWN,
	}[orientation];
}

export function getPrevKey(dir: TextDirection = "ltr", orientation: Orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
		vertical: kbd.ARROW_UP,
	}[orientation];
}

export function getDirectionalKeys(
	dir: TextDirection = "ltr",
	orientation: Orientation = "horizontal"
) {
	return {
		nextKey: getNextKey(dir, orientation),
		prevKey: getPrevKey(dir, orientation),
	};
}
