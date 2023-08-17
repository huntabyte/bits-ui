<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	export let asChild = false;
	const input = ctx.get().elements.input;
</script>

{#if asChild}
	<slot builder={$input} />
{:else}
	<input use:melt={$input} hidden {...$$restProps} />
{/if}
