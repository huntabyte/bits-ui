<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	export let asChild = false;
	const input = getCtx().elements.hiddenInput;
	$: builder = $input;
	const attrs = getAttrs("input");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<input use:melt={builder} hidden {...$$restProps} {...attrs} />
{/if}
