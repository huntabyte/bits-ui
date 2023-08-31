<script lang="ts">
	import { onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";
	import { type TransitionTimes, isBrowser } from "$lib/internal/index.js";

	type $$Props = Props;

	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let forceVisible: $$Props["forceVisible"] = true;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;

	const transitionTimes = writable<TransitionTimes>({});
	const tOpen = writable(open);
	let timeout = 0;
	const {
		states: { open: localOpen },
		updateOption
	} = ctx.set({
		closeOnEscape,
		preventScroll,
		closeOnOutsideClick,
		portal,
		forceVisible,
		defaultOpen: open,
		transitionTimes,
		tOpen,
		onOpenChange: ({ next }) => {
			if (!isBrowser) {
				return next;
			}
			window.clearTimeout(timeout);
			if (open !== next) {
				onOpenChange?.(next);
			}
			if (next !== $tOpen) {
				tOpen.set(next);
				if (!next) {
					timeout = window.setTimeout(
						() => {
							localOpen.set(next);
						},
						$transitionTimes.out ? $transitionTimes.out * 0.6 : 0
					);
					open = !next;
					return !next;
				} else {
					open = next;
					return next;
				}
			}
			open = next;
			return next;
		}
	});

	onDestroy(() => {
		if (isBrowser) {
			window.clearTimeout(timeout);
		}
	});

	$: open !== undefined && localOpen.set(open);

	$: updateOption("preventScroll", preventScroll);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("portal", portal);
	$: updateOption("forceVisible", forceVisible);
</script>

<slot />
