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
	export let asChild: $$Props["asChild"] = false;
	export let sideOffset: $$Props["sideOffset"] = 4;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { content },
		states: { open },
		ids
	} = getCtx(sideOffset);

	const dispatch = createDispatcher();
	const attrs = getAttrs("content");

	$: if (id) {
		ids.content.set(id);
	}
	$: builder = $content;
	$: slotProps = { builder, attrs };
</script>

{#if asChild && $open}
	<slot {...slotProps} />
{:else if transition && $open}
	<div
		use:melt={builder}
		transition:transition={transitionConfig}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
	</div>
{:else if $open}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
	>
		<slot {...slotProps} />
	</div>
{/if}
