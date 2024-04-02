<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { GridHeadProps } from "../index.js";

	type $$Props = GridHeadProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { getCalendarAttrs } = getCtx();

	const attrs = {
		...getCalendarAttrs("grid-head"),
		"aria-hidden": true,
	};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</thead>
{/if}
