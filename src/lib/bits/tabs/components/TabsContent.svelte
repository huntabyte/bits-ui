<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	export let value: $$Props["value"];
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { content }
	} = getCtx();

	$: builder = $content(value);
	const attrs = getAttrs("content");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
