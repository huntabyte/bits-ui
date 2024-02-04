import { isClient } from "./is";

export async function onKeyStroke(key: string, callback: (event: KeyboardEvent) => void) {
	if (!isClient) return;

	const unsub = $effect.root(() => {
		window.addEventListener("keydown", (event) => {
			if (event.key === key) callback(event);
		});

		return () => {
			unsub();
		};
	});
}
