<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { InputProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = InputProps;
	export let asChild = false;
	const itemInput = ctx.get().elements.itemInput;
</script>

{#if asChild}
	<slot builder={$itemInput} />
{:else}
	<input use:melt={$itemInput} hidden {...$$restProps} />
{/if}
