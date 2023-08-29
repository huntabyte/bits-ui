<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";

	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/types.js";
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
		elements: { menu },
		states: { open }
	} = ctx.get();
	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild && $open}
	{@const builder = $menu}
	<slot {builder} />
{:else if transition && $open}
	{@const builder = $menu}
	<div
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	{@const builder = $menu}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	{@const builder = $menu}
	<div
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	{@const builder = $menu}
	<div
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{:else if $open}
	{@const builder = $menu}
	<div use:melt={builder} {...$$restProps} on:m-keydown={dispatch}>
		<slot {builder} />
	</div>
{/if}
