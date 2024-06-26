<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../index.js";

	type $$Props = Props;

	export let disabled: $$Props["disabled"] = undefined;
	export let min: $$Props["min"] = undefined;
	export let max: $$Props["max"] = undefined;
	export let step: $$Props["step"] = undefined;
	export let orientation: $$Props["orientation"] = undefined;
	export let dir: $$Props["dir"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root, ticks, thumbs },
		states: { value: localValue },
		updateOption,
		getAttrs,
	} = setCtx({
		disabled,
		dir,
		min,
		max,
		step,
		orientation,
		defaultValue: value,
		onValueChange: ({ next }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		},
	});

	const attrs = getAttrs("root");

	$: value !== undefined && localValue.set(value);
	$: updateOption("disabled", disabled);
	$: updateOption("min", min);
	$: updateOption("max", max);
	$: updateOption("step", step);
	$: updateOption("orientation", orientation);
	$: updateOption("dir", dir);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} ticks={$ticks} thumbs={$thumbs} />
{:else}
	<span bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} ticks={$ticks} thumbs={$thumbs} />
	</span>
{/if}
