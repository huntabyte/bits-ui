<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioItemEvents, RadioItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = RadioItemProps;
	type $$Events = RadioItemEvents;
	export let value: $$Props["value"];
	export let disabled = false;
	export let asChild = false;
	const {
		elements: { radioItem }
	} = ctx.setRadioItem(value);

	$: builder = $radioItem({ value, disabled });

	const attrs = ctx.getAttrs("radio-item");

	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
