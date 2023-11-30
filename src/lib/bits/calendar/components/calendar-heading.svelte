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

	$: slotProps = {
		builder,
		attrs,
		headingValue: $headingValue
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps}>
			{$headingValue}
		</slot>
	</div>
{/if}
