<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let max: $$Props["max"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild = false;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = ctx.set({
		max,
		defaultValue: value,
		onValueChange: ({ next }) => {
			onValueChange?.(next);
			value = next;
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);
	$: updateOption("max", max);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	{@const builder = $root}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
