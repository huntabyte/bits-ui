<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;
	type $$Events = ContentEvents;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;

	export let asChild = false;
	export let sideOffset = 4;

	const {
		elements: { content },
		states: { open }
	} = ctx.get(sideOffset);

	const dispatch = createDispatcher();
</script>

{#if $open}
	{@const builder = $content}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			use:melt={builder}
			transition:transition|global={transitionConfig}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			use:melt={builder}
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			use:melt={builder}
			in:inTransition|global={inTransitionConfig}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			use:melt={builder}
			out:outTransition|global={outTransitionConfig}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{:else}
		<div
			use:melt={builder}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{/if}
{/if}
