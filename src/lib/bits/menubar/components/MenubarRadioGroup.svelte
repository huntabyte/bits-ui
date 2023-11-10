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
				value = next;
				onValueChange?.(next);
			}
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);

	$: builder = $radioGroup;
	const attrs = getAttrs("radio-group");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
