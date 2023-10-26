<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { getCtx, getAttrs } from "../ctx.js";
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
	} = getCtx(sideOffset);

	const dispatch = createDispatcher();

	$: builder = $content;
	const attrs = getAttrs("content");
</script>

{#if asChild && $open}
	<slot {builder} {attrs} />
{:else if transition && $open}
	<div
		use:melt={builder}
		transition:transition={transitionConfig}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if inTransition && outTransition && $open}
	<div
		use:melt={builder}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if inTransition && $open}
	<div
		use:melt={builder}
		in:inTransition={inTransitionConfig}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if outTransition && $open}
	<div
		use:melt={builder}
		out:outTransition={outTransitionConfig}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if $open}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
