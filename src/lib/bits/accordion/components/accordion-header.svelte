<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { HeaderProps } from "../types.js";

	type $$Props = HeaderProps;

	export let level = 3;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { heading: header }
	} = getCtx();

	const attrs = getAttrs("header");

	$: builder = $header(level);
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
