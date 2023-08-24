<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { disabledAttrs } from "$lib/internal/helpers.js";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";

	type $$Props = SubTriggerProps;
	type $$Events = SubTriggerEvents;
	export let disabled = false;
	export let asChild = false;
	const subTrigger = ctx.getSub().elements.subTrigger;
	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$subTrigger} />
{:else}
	{@const builder = $subTrigger}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
		{...disabledAttrs(disabled)}
	>
		<slot {builder} />
	</div>
{/if}
