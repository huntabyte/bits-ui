<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { InputProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = InputProps;
	export let asChild = false;
	const hiddenInput = ctx.get().elements.hiddenInput;
	$: builder = $hiddenInput;
	const attrs = ctx.getAttrs("input");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<input use:melt={builder} {...$$restProps} {...attrs} />
{/if}
