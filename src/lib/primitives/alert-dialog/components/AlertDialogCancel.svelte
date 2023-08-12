<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild = false;
	const cancel = ctx.getClose();
</script>

{#if asChild}
	<slot cancel={$cancel} />
{:else}
	<button use:melt={$cancel} on:click on:keydown on:m-click on:m-keydown {...$$restProps}>
		<slot cancel={$cancel} />
	</button>
{/if}
