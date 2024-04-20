import { untrack } from "svelte";

export function useMounted() {
	let mounted = $state(false);
	$effect(() => {
		untrack(() => (mounted = true));
		return () => {
			untrack(() => (mounted = false));
		};
	});

	return {
		get value() {
			return mounted;
		},
	};
}
