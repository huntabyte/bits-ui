<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let max: $$Props["max"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx({
		max,
		defaultValue: value,
		onValueChange: ({ next }) => {
			onValueChange?.(next);
			value = next;
			return next;
		}
	});

	const attrs = getAttrs("root");

	$: value !== undefined && localValue.set(value);
	$: updateOption("max", max);

	$: builder = $root;
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
