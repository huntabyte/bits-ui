<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { GridBodyCellProps } from "../types.js";

	type $$Props = GridBodyCellProps;

	export let date: $$Props["date"];
	export let month: $$Props["month"];
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { cell },
		helpers: { isDateDisabled, isDateUnavailable, isDateSelected }
	} = getCtx();

	$: builder = $cell(date, month);
	const attrs = getAttrs("grid-body-cell");

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
	<td role="gridcell" aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}>
		<div use:melt={builder} {...attrs} {...$$restProps}>
			<slot {...slotProps} />
		</div>
	</td>
{/if}
