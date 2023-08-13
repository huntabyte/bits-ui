<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let orientation: $$Props["orientation"] = undefined;
	export let activateOnFocus: $$Props["activateOnFocus"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let autoSet: $$Props["autoSet"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild = false;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = ctx.set({
		orientation,
		activateOnFocus,
		loop,
		autoSet,
		defaultValue: value,
		onValueChange: ({ next }) => {
			onValueChange?.(next);
			value = next;
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);
	$: updateOption("orientation", orientation);
	$: updateOption("activateOnFocus", activateOnFocus);
	$: updateOption("loop", loop);
	$: updateOption("autoSet", autoSet);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	<div use:melt={$root} {...$$restProps}>
		<slot builder={$root} />
	</div>
{/if}
