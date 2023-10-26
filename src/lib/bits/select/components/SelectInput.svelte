<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	export let asChild = false;
	const input = ctx.get().elements.hiddenInput;
	$: builder = $input;
	const attrs = ctx.getAttrs("input");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<input use:melt={builder} hidden {...$$restProps} {...attrs} />
{/if}
