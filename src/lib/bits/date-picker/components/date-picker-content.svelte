<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import { getCtx, getPopoverAttrs, updatePositioning } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;

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
	export let sameWidth: $$Props["sameWidth"] = false;
	export let fitViewport: $$Props["fitViewport"] = false;
	export let strategy: $$Props["strategy"] = "absolute";
	export let overlap: $$Props["overlap"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		states: { open },
		ids
	} = getCtx();

	const attrs = getPopoverAttrs("content");

	$: if (id) {
		ids.popover.content.set(id);
	}

	$: builder = $content;
	$: Object.assign(builder, attrs);

	$: updatePositioning({
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

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if $open}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
