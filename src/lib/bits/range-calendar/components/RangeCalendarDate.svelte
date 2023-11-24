<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { DateProps } from "../types.js";

	type $$Props = DateProps;

	export let date: $$Props["date"];
	export let month: $$Props["month"];
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { cell },
		helpers: { isDateDisabled, isDateUnavailable, isDateSelected }
	} = getCtx();

	$: builder = $cell(date, month);
	const attrs = getAttrs("date");

	$: slotProps = {
		builder,
		attrs,
		disabled: $isDateDisabled(date),
		unavailable: $isDateUnavailable(date),
		selected: $isDateSelected(date)
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...attrs} {...$$restProps}>
		<slot {...slotProps}>
			{date.day}
		</slot>
	</div>
{/if}
