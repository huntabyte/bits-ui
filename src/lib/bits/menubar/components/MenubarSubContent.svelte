<script lang="ts">
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
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
	} = ctx.getSub();

	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if asChild && $subOpen}
	{@const builder = $subMenu}
	<slot {builder} />
{:else if transition && $subOpen}
	{@const builder = $subMenu}
	<div
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $subOpen}
	{@const builder = $subMenu}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $subOpen}
	{@const builder = $subMenu}
	<div
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $subOpen}
	{@const builder = $subMenu}
	<div
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if $subOpen}
	{@const builder = $subMenu}
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
