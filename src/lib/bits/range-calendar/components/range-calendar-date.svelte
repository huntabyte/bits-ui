<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { DateEvents, DateProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = DateProps;
	type $$Events = DateEvents;

	export let date: $$Props["date"];
	export let month: $$Props["month"];
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { cell },
		helpers: { isDateDisabled, isDateUnavailable }
	} = getCtx();

	const attrs = getAttrs("date");
	const dispatch = createDispatcher();

	$: builder = $cell(date, month);
	$: Object.assign(builder, attrs);

	$: slotProps = {
		builder,
		disabled: $isDateDisabled(date),
		unavailable: $isDateUnavailable(date)
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-mouseenter={dispatch}
	>
		<slot {...slotProps}>
			{date.day}
		</slot>
	</div>
{/if}
