<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Transition } from "$internal/types.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type $$Props = SubContentProps<T>;
	type $$Events = SubContentEvents;
	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let asChild = false;

	const {
		elements: { subMenu },
		states: { subOpen }
	} = ctx.getSubContent();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if $subOpen}
	{@const builder = $subMenu}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			use:melt={builder}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
			transition:transition={transitionConfig}
		>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps} on:m-focusout on:m-keydown on:m-pointermove>
			<slot {builder} />
		</div>
	{/if}
{/if}
