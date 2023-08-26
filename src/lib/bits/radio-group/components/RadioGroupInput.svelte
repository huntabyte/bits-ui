<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { InputProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = InputProps;
	export let asChild = false;
	const hiddenInput = ctx.get().elements.hiddenInput;
</script>

{#if asChild}
	<slot builder={$hiddenInput} />
{:else}
	<input use:melt={$hiddenInput} {...$$restProps} />
{/if}
