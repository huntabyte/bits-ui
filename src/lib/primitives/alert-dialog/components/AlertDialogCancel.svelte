<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild = false;
	const close = ctx.get().elements.close;
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	<button use:melt={$close} on:click on:keydown on:m-click on:m-keydown {...$$restProps}>
		<slot builder={$close} />
	</button>
{/if}
