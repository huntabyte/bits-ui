<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { CellProps } from "../index.js";

	type $$Props = CellProps;

	export let date: $$Props["date"];
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		helpers: { isDateDisabled, isDateUnavailable },
		getCalendarAttrs,
	} = getCtx();

	$: attrs = {
		...getCalendarAttrs("cell"),
		"aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
		"data-disabled": $isDateDisabled(date) ? "" : undefined,
		role: "gridcell",
	};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<td bind:this={ref} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</td>
{/if}
