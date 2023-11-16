<script lang="ts">
	import { setSubMenuCtx } from "../ctx.js";
	import type { SubProps } from "../types.js";
	type $$Props = SubProps;

	export let positioning: $$Props["positioning"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;

	const {
		updateOption,
		ids,
		states: { subOpen }
	} = setSubMenuCtx({
		positioning,
		disabled,
		arrowSize,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	$: open !== undefined && subOpen.set(open);

	$: updateOption("positioning", positioning);
	$: updateOption("disabled", disabled);
	$: updateOption("arrowSize", arrowSize);
</script>

<slot subIds={ids} />
