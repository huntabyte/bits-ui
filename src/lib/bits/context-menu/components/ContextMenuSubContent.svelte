<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";

	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Transition } from "$lib/internal/types.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;
	type $$Props = SubContentProps<T, In, Out>;

	type $$Events = SubContentEvents;
	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;
	export let asChild = false;

	const {
		elements: { subMenu },
		states: { subOpen }
	} = ctx.getSubContent();

	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if $subOpen}
	{@const builder = $subMenu}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-keydown={dispatch}
			on:m-pointermove={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-keydown={dispatch}
			on:m-pointermove={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-keydown={dispatch}
			on:m-pointermove={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-keydown={dispatch}
			on:m-pointermove={dispatch}
		>
			<slot {builder} />
		</div>
	{:else}
		<div
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-keydown={dispatch}
			on:m-pointermove={dispatch}
		>
			<slot {builder} />
		</div>
	{/if}
{/if}
