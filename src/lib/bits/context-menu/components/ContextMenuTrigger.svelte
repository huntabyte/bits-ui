<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import Overlay from "$lib/internal/overlay.svelte";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger },
		states: { open }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	{#if $open}
		<Overlay />
	{/if}
	<slot builder={$trigger} />
{:else}
	{#if $open}
		<Overlay />
	{/if}
	{@const builder = $trigger}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-contextmenu
		on:m-pointercancel
		on:m-pointerdown
		on:m-pointermove
		on:m-pointerup
	>
		<slot {builder} />
	</div>
{/if}
