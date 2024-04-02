<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { GridBodyProps } from "../index.js";

	type $$Props = GridBodyProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { getAttrs } = getCtx();

	const attrs = getAttrs("grid-body");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tbody bind:this={el} {...$$restProps} {...attrs}>
		<slot />
	</tbody>
{/if}
