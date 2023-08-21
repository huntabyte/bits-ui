<script lang="ts">
	import { writable } from "svelte/store";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";
	import type { TransitionTimes } from "$lib/internal/types.js";
	import { sleep } from "$lib/internal/helpers.js";

	type $$Props = Props;

	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let forceVisible: $$Props["forceVisible"] = true;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;

	const transitionTimes = writable<TransitionTimes>({});
	const tOpen = writable(false);

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
			open = next;
			if (next !== $tOpen) {
				tOpen.set(next);
				if (next) {
					setTimeout(
						() => {
							localOpen.set(next);
						},
						$transitionTimes.in ? $transitionTimes.in + 100 : 0
					);
				} else {
					setTimeout(
						() => {
							localOpen.set(next);
						},
						$transitionTimes.out ? $transitionTimes.out + 100 : 0
					);
				}
				return !next;
			}
			onOpenChange?.(next);
			return next;
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
