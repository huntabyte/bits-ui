<script lang="ts">
	import { getCalendarAttrs } from "../ctx.js";
	import type { HeadCellProps } from "../types.js";

	type $$Props = HeadCellProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getCalendarAttrs("head-cell");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<th {...$$restProps} {...attrs}>
		<slot />
	</th>
{/if}
