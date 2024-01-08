<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = false;
	export let portal: $$Props["portal"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let openFocus: $$Props["openFocus"] = undefined;
	export let closeFocus: $$Props["closeFocus"] = undefined;
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		states: { open: localOpen },
		updateOption,
		ids
	} = setCtx({
		closeOnEscape,
		preventScroll,
		closeOnOutsideClick,
		portal,
		forceVisible: true,
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
		[ids.content, ids.description, ids.title],
		([$contentId, $descriptionId, $titleId]) => ({
			content: $contentId,
			description: $descriptionId,
			title: $titleId
		})
	);

	$: open !== undefined && localOpen.set(open);

	$: updateOption("preventScroll", preventScroll);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("portal", portal);
	$: updateOption("openFocus", openFocus);
	$: updateOption("closeFocus", closeFocus);
	$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
