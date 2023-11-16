<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { hiddenInput },
		options: { disabled }
	} = getCtx();

	const attrs = getAttrs("input");

	$: builder = $hiddenInput;
	$: slotProps = { builder, attrs: { ...attrs, disabled: $disabled ? true : undefined } };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<input use:melt={builder} {...$$restProps} {...attrs} disabled={$disabled ? true : undefined} />
{/if}
