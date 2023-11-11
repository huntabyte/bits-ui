<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { HeadingProps } from "../types.js";

	type $$Props = HeadingProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { heading },
		states: { headingValue }
	} = getCtx();

	$: builder = $heading;
	const attrs = getAttrs("heading");
</script>

{#if asChild}
	<slot {builder} {attrs} headingValue={$headingValue} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} headingValue={$headingValue}>
			{$headingValue}
		</slot>
	</div>
{/if}
