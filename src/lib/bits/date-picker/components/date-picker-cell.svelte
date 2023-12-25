<script lang="ts">
	import { getCtx, getCalendarAttrs } from "../ctx.js";
	import type { CellProps } from "../types.js";

	type $$Props = CellProps;

	export let date: $$Props["date"];
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		helpers: { isDateDisabled, isDateUnavailable }
	} = getCtx();

	$: attrs = {
		...getCalendarAttrs("cell"),
		"aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
		"data-disabled": $isDateDisabled(date) ? "" : undefined,
		role: "gridcell"
	};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<td bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</td>
{/if}
