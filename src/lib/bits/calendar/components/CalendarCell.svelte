<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { GridBodyCellProps } from "../types.js";

	type $$Props = GridBodyCellProps;

	export let date: $$Props["date"];
	export let asChild: $$Props["asChild"] = false;

	const {
		helpers: { isDateDisabled, isDateUnavailable }
	} = getCtx();

	$: attrs = {
		...getAttrs("grid-body-cell"),
		"aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
		role: "gridcell"
	};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<td {...attrs}>
		<slot {attrs} />
	</td>
{/if}
