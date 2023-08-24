<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";

	type $$Props = SubTriggerProps & {
		disabled?: boolean;
	};
	type $$Events = SubTriggerEvents;
	export let disabled = false;
	export let asChild = false;

	const {
		elements: { subTrigger }
	} = ctx.getSubTrigger();
	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
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
		on:m-keydown={dispatch}
		{...disabledAttrs(disabled)}
	>
		<slot {builder} />
	</div>
{/if}
