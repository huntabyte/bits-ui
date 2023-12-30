<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { getAttrs, getSubmenuCtx, updateSubPositioning } from "../ctx.js";
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
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let side: $$Props["side"] = "right";
	export let align: $$Props["align"] = "start";
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
		elements: { subMenu },
		states: { subOpen },
		ids
	} = getSubmenuCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("sub-content");

	$: if (id) {
		ids.menu.set(id);
	}

	$: builder = $subMenu;
	$: Object.assign(builder, attrs);

	$: updateSubPositioning({
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
		overlap
	});
</script>

{#if asChild && $subOpen}
	<slot {builder} />
{:else if transition && $subOpen}
	<div
		bind:this={el}
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
	<div
		bind:this={el}
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
	<div
		bind:this={el}
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
	<div
		bind:this={el}
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
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
