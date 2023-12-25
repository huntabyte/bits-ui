<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { GridBodyProps } from "../types.js";

	type $$Props = GridBodyProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const attrs = getAttrs("grid-body");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tbody bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tbody>
{/if}
