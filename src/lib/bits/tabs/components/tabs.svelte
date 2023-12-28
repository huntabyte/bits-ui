<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let orientation: $$Props["orientation"] = undefined;
	export let activateOnFocus: $$Props["activateOnFocus"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let autoSet: $$Props["autoSet"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx({
		orientation,
		activateOnFocus,
		loop,
		autoSet,
		defaultValue: value,
		onValueChange: ({ next }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		}
	});

	const attrs = getAttrs("root");

	$: value !== undefined && localValue.set(value);
	$: updateOption("orientation", orientation);
	$: updateOption("activateOnFocus", activateOnFocus);
	$: updateOption("loop", loop);
	$: updateOption("autoSet", autoSet);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} value={$localValue} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} value={$localValue} />
	</div>
{/if}
