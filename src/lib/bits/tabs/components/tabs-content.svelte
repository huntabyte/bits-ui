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
	const attrs = getAttrs("content");

	$: builder = $content(value);

	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
