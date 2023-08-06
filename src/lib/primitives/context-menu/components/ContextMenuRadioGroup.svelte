<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioGroupProps } from "../types.js";

	type $$Props = RadioGroupProps;
	export let value: $$Props["value"] = undefined;

	const {
		elements: { radioGroup },
		states: { value: localValue }
	} = ctx.setRadioGroup({
		defaultValue: value,
		onValueChange: ({ next }) => {
			if (next) {
				value = next;
			}
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);
</script>

<div use:melt={$radioGroup} {...$$restProps}>
	<slot />
</div>
