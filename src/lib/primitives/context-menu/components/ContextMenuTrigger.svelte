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

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<div
		use:melt={$trigger}
		{...$$restProps}
		on:click
		on:m-contextmenu
		on:m-pointercancel
		on:m-pointerdown
		on:m-pointermove
		on:m-pointerup
	>
		<slot trigger={$trigger} />
	</div>
{/if}
