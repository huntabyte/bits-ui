<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
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
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		states: { open },
		ids
	} = getCtx();
	const attrs = getAttrs("content");

	$: if (id) {
		ids.content.set(id);
	}

	$: builder = $content;
	$: Object.assign(builder, attrs);
</script>

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:pointerdown
		on:pointermove
		on:pointerup
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		on:pointerdown
		on:pointermove
		on:pointerup
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		on:pointerdown
		on:pointermove
		on:pointerup
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		on:pointerdown
		on:pointermove
		on:pointerup
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if $open}
	<div
		bind:this={el}
		use:melt={builder}
		on:pointerdown
		on:pointermove
		on:pointerup
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{/if}
