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
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
