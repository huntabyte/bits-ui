<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let closeOnPointerDown: $$Props["closeOnPointerDown"] = undefined;
	export let openDelay: $$Props["openDelay"] = undefined;
	export let closeDelay: $$Props["closeDelay"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let disableHoverableContent: $$Props["disableHoverableContent"] =
		undefined;
	export let group: $$Props["group"] = undefined;

	const {
		states: { open: localOpen },
		updateOption,
		ids
	} = setCtx({
		closeOnEscape,
		portal,
		closeOnPointerDown,
		openDelay,
		closeDelay,
		forceVisible: true,
		defaultOpen: open,
		disableHoverableContent,
		group,
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
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("portal", portal);
	$: updateOption("closeOnPointerDown", closeOnPointerDown);
	$: updateOption("openDelay", openDelay);
	$: updateOption("closeDelay", closeDelay);
	$: updateOption("group", group);
	$: updateOption("disableHoverableContent", disableHoverableContent);
</script>

<slot ids={$idValues} />
