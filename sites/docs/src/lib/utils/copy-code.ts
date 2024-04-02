import { writable } from "svelte/store";
import { browser } from "$app/environment";

export function createCopyCodeButton() {
	let codeString = "";
	const copied = writable(false);
	let copyTimeout = 0;

	function copyCode() {
		if (!browser) return;
		navigator.clipboard.writeText(codeString);
		copied.set(true);
		clearTimeout(copyTimeout);
		copyTimeout = window.setTimeout(() => {
			copied.set(false);
		}, 2500);
	}

	function setCodeString(node: HTMLElement) {
		codeString = node.innerText.trim() ?? "";
	}

	return {
		copied,
		copyCode,
		setCodeString,
	};
}
