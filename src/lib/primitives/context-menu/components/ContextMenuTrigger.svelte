<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot builder={$trigger} />
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
		<slot builder={$trigger} />
	</div>
{/if}
