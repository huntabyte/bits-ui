<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createCustomEventDispatcher } from "$lib/index.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
	const dispatch = createCustomEventDispatcher();
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
		on:m-blur={dispatch}
		on:m-focus={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</svelte:element>
{/if}
