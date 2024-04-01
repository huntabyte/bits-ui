<script lang="ts">
	import type { CornerProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = CornerProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { corner },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("corner");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $corner;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
