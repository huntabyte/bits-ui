<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { GridRowProps } from "../types.js";

	type $$Props = GridRowProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const attrs = getAttrs("grid-row");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tr bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tr>
{/if}
