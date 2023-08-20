<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
	<svelte:element
		this={"a"}
		use:melt={builder}
		{...$$restProps}
		on:m-blur
		on:m-focus
		on:m-pointerenter
		on:m-pointerleave
	>
		<slot {builder} />
	</svelte:element>
{/if}
