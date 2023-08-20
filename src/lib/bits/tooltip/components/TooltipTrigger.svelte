<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
	<button
		use:melt={builder}
		{...$$restProps}
		on:m-blur
		on:m-focus
		on:m-keydown
		on:m-pointerdown
		on:m-pointerenter
		on:m-pointerleave
	>
		<slot {builder} />
	</button>
{/if}
