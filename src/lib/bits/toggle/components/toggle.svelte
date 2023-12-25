<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;

	export let disabled: $$Props["disabled"] = undefined;
	export let pressed: $$Props["pressed"] = undefined;
	export let onPressedChange: $$Props["onPressedChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { pressed: localPressed },
		updateOption
	} = setCtx({
		disabled,
		defaultPressed: pressed,
		onPressedChange: ({ next }) => {
			if (pressed !== next) {
				onPressedChange?.(next);
				pressed = next;
			}
			return next;
		}
	});

	const dispatch = createDispatcher();
	const attrs = getAttrs("root");

	$: pressed !== undefined && localPressed.set(pressed);
	$: updateOption("disabled", disabled);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
