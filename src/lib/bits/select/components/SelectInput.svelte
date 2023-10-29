<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	export let asChild = false;
	const {
		elements: { hiddenInput },
		options: { disabled }
	} = getCtx();
	$: builder = $hiddenInput;
	const attrs = getAttrs("input");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<input use:melt={builder} {...$$restProps} {...attrs} disabled={$disabled ? true : undefined} />
{/if}
