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

	const {
		elements: { content },
		states: { open }
	} = ctx.get();

	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild && $open}
	{@const builder = $content}
	<slot {builder} />
{:else if transition && $open}
	{@const builder = $content}
	<div
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	{@const builder = $content}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	{@const builder = $content}
	<div
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	{@const builder = $content}
	<div
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if $open}
	{@const builder = $content}
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
