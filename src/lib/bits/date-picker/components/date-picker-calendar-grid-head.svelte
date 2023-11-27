<script lang="ts">
	import { getCalendarAttrs } from "../ctx.js";
	import type { GridHeadProps } from "../types.js";

	type $$Props = GridHeadProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = { ...getCalendarAttrs("grid-head"), "aria-hidden": true };
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead {...$$restProps} {...attrs}>
		<slot />
	</thead>
{/if}
