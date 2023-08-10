<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let required: $$Props["required"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let orientation: $$Props["orientation"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = ctx.set({
		required,
		disabled,
		defaultValue: value,
		loop,
		orientation,
		onValueChange: ({ next }) => {
			value = next;
			onValueChange?.(next);
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);
	$: updateOption("required", required);
	$: updateOption("disabled", disabled);
	$: updateOption("loop", loop);
	$: updateOption("orientation", orientation);
</script>

<div use:melt={$root} {...$$restProps}>
	<slot />
</div>
