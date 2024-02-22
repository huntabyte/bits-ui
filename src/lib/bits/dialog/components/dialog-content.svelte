<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import { getCtx } from "../ctx.js";
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
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		states: { open },
		ids,
		getAttrs,
	} = getCtx();
	const attrs = getAttrs("content");

	$: if (id) {
		ids.content.set(id);
	}

	$: builder = $content;
	$: Object.assign(builder, attrs);
</script>

{#if $open}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			bind:this={el}
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:pointerdown
			on:pointermove
			on:pointerup
			on:touchend
			on:touchstart
			on:touchcancel
			on:touchmove
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			on:pointerdown
			on:pointermove
			on:pointerup
			on:touchend
			on:touchstart
			on:touchcancel
			on:touchmove
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			on:pointerdown
			on:pointermove
			on:pointerup
			on:touchend
			on:touchstart
			on:touchcancel
			on:touchmove
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			bind:this={el}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			on:pointerdown
			on:pointermove
			on:pointerup
			on:touchend
			on:touchstart
			on:touchcancel
			on:touchmove
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else}
		<div
			bind:this={el}
			use:melt={builder}
			on:pointerdown
			on:pointermove
			on:pointerup
			on:touchend
			on:touchstart
			on:touchcancel
			on:touchmove
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{/if}
{/if}
