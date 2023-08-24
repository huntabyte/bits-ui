<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import type { Transition } from "$lib/internal/index.js";
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

	const {
		elements: { content },
		states: { open }
	} = ctx.get();

	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if $open}
	{@const builder = $content}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
			on:m-pointerleave={dispatch}
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
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
			on:m-pointerleave={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
			on:m-pointerleave={dispatch}
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
			on:m-pointerleave={dispatch}
		>
			<slot {builder} />
		</div>
	{:else}
		<div
			use:melt={builder}
			{...$$restProps}
			on:m-focusout={dispatch}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
			on:m-pointerleave={dispatch}
		>
			<slot {builder} />
		</div>
	{/if}
{/if}
