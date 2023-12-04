<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { HeadCellProps } from "../types.js";

	type $$Props = HeadCellProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getAttrs("head-cell");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<th {...$$restProps} {...attrs}>
		<slot {attrs} />
	</th>
{/if}
