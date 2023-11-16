<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setRadioGroupCtx, getAttrs } from "../ctx.js";
	import type { RadioGroupProps } from "../types.js";

	type $$Props = RadioGroupProps;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { radioGroup },
		states: { value: localValue }
	} = setRadioGroupCtx({
		defaultValue: value,
		onValueChange: ({ next }) => {
			if (next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		}
	});
	const attrs = getAttrs("radio-group");

	$: value !== undefined && localValue.set(value);
	$: builder = $radioGroup;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
