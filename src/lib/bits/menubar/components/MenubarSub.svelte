<script lang="ts">
	import { derived } from "svelte/store";
	import { setSubMenuCtx } from "../ctx.js";
	import type { SubProps } from "../types.js";

	type $$Props = SubProps;

	export let disabled: $$Props["disabled"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;

	const {
		updateOption,
		ids,
		states: { subOpen }
	} = setSubMenuCtx({
		disabled,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	const idValues = derived(
		[ids.menu, ids.trigger],
		([$menuId, $triggerId]) => ({
			menu: $menuId,
			trigger: $triggerId
		})
	);

	$: open !== undefined && subOpen.set(open);

	$: updateOption("disabled", disabled);
</script>

<slot subIds={$idValues} />
