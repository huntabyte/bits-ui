<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { InputProps } from "../types.js";
	import { getCtx, getAttrs } from "../ctx.js";

	type $$Props = InputProps;
	export let asChild = false;
	const hiddenInput = getCtx().elements.hiddenInput;
	$: builder = $hiddenInput;
	const attrs = getAttrs("input");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<input use:melt={builder} {...$$restProps} {...attrs} />
{/if}
