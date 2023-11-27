<script lang="ts">
	import { getCalendarAttrs } from "../ctx.js";
	import type { GridBodyProps } from "../types.js";

	type $$Props = GridBodyProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getCalendarAttrs("grid-body");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tbody {...$$restProps} {...attrs}>
		<slot />
	</tbody>
{/if}
