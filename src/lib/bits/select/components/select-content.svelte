<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";

	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/types.js";
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
	export let side: $$Props["side"] = "bottom";
	export let align: $$Props["align"] = "center";
	export let sideOffset: $$Props["sideOffset"] = 0;
	export let alignOffset: $$Props["alignOffset"] = 0;
	export let collisionPadding: $$Props["collisionPadding"] = 8;
	export let avoidCollisions: $$Props["avoidCollisions"] = true;
	export let collisionBoundary: $$Props["collisionBoundary"] = undefined;
	export let sameWidth: $$Props["sameWidth"] = true;
	export let fitViewport: $$Props["fitViewport"] = false;
	export let strategy: $$Props["strategy"] = "absolute";
	export let overlap: $$Props["overlap"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { menu },
		states: { open },
		ids,
		getAttrs,
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("content");

	$: if (id) {
		ids.menu.set(id);
	}

	$: builder = $menu;
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

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if $open}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			bind:this={el}
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-pointerleave={dispatch}
			on:keydown
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-pointerleave={dispatch}
			on:keydown
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-pointerleave={dispatch}
			on:keydown
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			bind:this={el}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-pointerleave={dispatch}
			on:keydown
		>
			<slot {builder} />
		</div>
	{:else}
		<div bind:this={el} use:melt={builder} {...$$restProps} on:m-pointerleave={dispatch} on:keydown>
			<slot {builder} />
		</div>
	{/if}
{/if}
