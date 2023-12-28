<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { InputProps } from "../types.js";
	import { getCtx, getAttrs } from "../ctx.js";

	type $$Props = InputProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { hiddenInput }
	} = getCtx();

	const attrs = getAttrs("input");

	$: builder = $hiddenInput;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<input bind:this={el} use:melt={builder} {...$$restProps} />
{/if}
