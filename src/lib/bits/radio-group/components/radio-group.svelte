<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let required: $$Props["required"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let orientation: $$Props["orientation"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx({
		required,
		disabled,
		defaultValue: value,
		loop,
		orientation,
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
	$: updateOption("required", required);
	$: updateOption("disabled", disabled);
	$: updateOption("loop", loop);
	$: updateOption("orientation", orientation);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
