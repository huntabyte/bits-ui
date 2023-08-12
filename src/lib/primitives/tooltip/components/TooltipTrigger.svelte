<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
</script>

{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<button
		use:melt={$trigger}
		{...$$restProps}
		on:m-blur
		on:m-focus
		on:m-keydown
		on:m-pointerdown
		on:m-pointerenter
		on:m-pointerleave
		on:click
		on:keydown
	>
		<slot trigger={$trigger} />
	</button>
{/if}
