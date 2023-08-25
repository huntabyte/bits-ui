<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;
	export let disabled: $$Props["disabled"] = undefined;
	export let pressed: $$Props["pressed"] = undefined;
	export let onPressedChange: $$Props["onPressedChange"] = undefined;
	export let asChild = false;
	const {
		elements: { root },
		states: { pressed: localPressed },
		updateOption
	} = ctx.set({
		disabled,
		defaultPressed: pressed,
		onPressedChange: ({ next }) => {
			onPressedChange?.(next);
			pressed = next;
			return next;
		}
	});

	const dispatch = createDispatcher();

	$: pressed !== undefined && localPressed.set(pressed);
	$: updateOption("disabled", disabled);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	{@const builder = $root}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch} on:m-keydown={dispatch}>
		<slot {builder} />
	</button>
{/if}
