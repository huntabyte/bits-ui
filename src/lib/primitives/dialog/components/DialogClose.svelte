<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CloseEvents, CloseProps } from "../types.js";

	type $$Props = CloseProps;
	type $$Events = CloseEvents;
	export let asChild = false;
	const {
		elements: { close }
	} = ctx.get();
</script>

{#if asChild}
	<slot close={$close} />
{:else}
	<button use:melt={$close} {...$$restProps} on:m-click on:m-keydown on:click on:keydown>
		<slot close={$close} />
	</button>
{/if}
