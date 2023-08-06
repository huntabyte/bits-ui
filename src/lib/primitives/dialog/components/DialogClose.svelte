<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CloseProps } from "../types.js";

	type $$Props = CloseProps;
	export let asChild = false;
	const close = ctx.getClose();
</script>

{#if asChild}
	<slot close={$close} />
{:else}
	<button use:melt={$close} {...$$restProps}>
		<slot close={$close} />
	</button>
{/if}
