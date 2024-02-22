<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { getCtx, updatePositioning } from "../ctx.js";
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
	export let id: $$Props["id"] = undefined;
	export let side: $$Props["side"] = "top";
	export let align: $$Props["align"] = "center";
	export let sideOffset: $$Props["sideOffset"] = 0;
	export let alignOffset: $$Props["alignOffset"] = 0;
	export let collisionPadding: $$Props["collisionPadding"] = 8;
	export let avoidCollisions: $$Props["avoidCollisions"] = true;
	export let collisionBoundary: $$Props["collisionBoundary"] = undefined;
	export let sameWidth: $$Props["sameWidth"] = false;
	export let fitViewport: $$Props["fitViewport"] = false;
	export let strategy: $$Props["strategy"] = "absolute";
	export let overlap: $$Props["overlap"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		states: { open },
		ids,
		getAttrs,
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("content");

	$: if (id) {
		ids.content.set(id);
	}
	$: builder = $content;
	$: Object.assign(builder, attrs);

	$: if ($open) {
		updatePositioning({
			side,
			align,
			sideOffset,
			alignOffset,
			collisionPadding,
			avoidCollisions,
			collisionBoundary,
			sameWidth,
			fitViewport,
			strategy,
			overlap,
		});
	}
</script>

{#if $open}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			bind:this={el}
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
			bind:this={el}
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
			bind:this={el}
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
			bind:this={el}
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
			bind:this={el}
			use:melt={builder}
			{...$$restProps}
			on:m-pointerdown={dispatch}
			on:m-pointerenter={dispatch}
		>
			<slot {builder} />
		</div>
	{/if}
{/if}
