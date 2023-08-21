<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;
	type $$Events = ContentEvents;

	export let transition: ContentProps<T, In, Out>["transition"] = undefined;
	export let transitionConfig: ContentProps<T, In, Out>["transitionConfig"] = undefined;
	export let inTransition: ContentProps<T, In, Out>["inTransition"] = undefined;
	export let inTransitionConfig: ContentProps<T>["inTransitionConfig"] = undefined;
	export let outTransition: ContentProps<T, In, Out>["outTransition"] = undefined;
	export let outTransitionConfig: ContentProps<T, In, Out>["outTransitionConfig"] = undefined;

	export let asChild = false;
	export let sideOffset: ContentProps<T>["sideOffset"] = 4;

	const {
		elements: { content },
		states: { open }
	} = ctx.get(sideOffset);
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
			on:m-pointerdown
			on:m-pointerenter
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			use:melt={builder}
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			{...$$restProps}
			on:m-pointerdown
			on:m-pointerenter
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			use:melt={builder}
			in:inTransition|global={inTransitionConfig}
			{...$$restProps}
			on:m-pointerdown
			on:m-pointerenter
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			use:melt={builder}
			out:outTransition|global={outTransitionConfig}
			{...$$restProps}
			on:m-pointerdown
			on:m-pointerenter
		>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps} on:m-pointerdown on:m-pointerenter>
			<slot {builder} />
		</div>
	{/if}
{/if}
