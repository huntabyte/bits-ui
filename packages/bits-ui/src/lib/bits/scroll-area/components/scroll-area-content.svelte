<script lang="ts">
	import type { ContentProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = ContentProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("content");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $content;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
