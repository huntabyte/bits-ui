<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Props } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = Props;

	export let multiple: $$Props["multiple"] = false;
	export let disabled: $$Props["disabled"] = false;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = ctx.set({
		multiple,
		disabled,
		defaultValue: value,
		onValueChange: ({ next }) => {
			value = next;
			onValueChange?.(next);
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);

	$: updateOption("multiple", multiple);
	$: updateOption("disabled", disabled);
</script>

<div use:melt={$root} {...$$restProps}>
	<slot />
</div>
