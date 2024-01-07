<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { getAttrs } = getCtx();

	const attrs = getAttrs("content");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		<slot />
	</div>
{/if}
