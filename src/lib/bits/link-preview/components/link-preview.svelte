<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";
	type $$Props = Props;

	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let openDelay: $$Props["openDelay"] = 700;
	export let closeDelay: $$Props["closeDelay"] = 300;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		states: { open: localOpen },
		updateOption,
		ids
	} = setCtx({
		defaultOpen: open,
		openDelay,
		closeDelay,
		closeOnOutsideClick,
		closeOnEscape,
		portal,
		onOutsideClick,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	const idValues = derived(
		[ids.content, ids.trigger],
		([$contentId, $triggerId]) => ({
			content: $contentId,
			trigger: $triggerId
		})
	);

	$: open !== undefined && localOpen.set(open);
	$: updateOption("openDelay", openDelay);
	$: updateOption("closeDelay", closeDelay);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("portal", portal);
	$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
