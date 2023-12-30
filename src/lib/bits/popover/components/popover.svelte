<script lang="ts">
	import type { Props } from "../types.js";
	import { setCtx } from "../ctx.js";
	import { derived } from "svelte/store";

	type $$Props = Props;
	export let disableFocusTrap: $$Props["disableFocusTrap"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let openFocus: $$Props["openFocus"] = undefined;
	export let closeFocus: $$Props["closeFocus"] = undefined;
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		updateOption,
		states: { open: localOpen },
		ids
	} = setCtx({
		disableFocusTrap,
		closeOnEscape,
		closeOnOutsideClick,
		preventScroll,
		portal,
		defaultOpen: open,
		openFocus,
		closeFocus,
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

	$: updateOption("disableFocusTrap", disableFocusTrap);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("portal", portal);
	$: updateOption("openFocus", openFocus);
	$: updateOption("closeFocus", closeFocus);
	$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
