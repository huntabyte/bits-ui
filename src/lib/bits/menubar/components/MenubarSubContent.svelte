<script lang="ts">
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { melt } from "@melt-ui/svelte";
	import { getSubMenuCtx, getAttrs } from "../ctx.js";
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

	const {
		elements: { subMenu },
		states: { subOpen },
		ids
	} = getSubMenuCtx();

	const dispatch = createDispatcher();

	$: if (id) {
		ids.menu.set(id);
	}
	$: builder = $subMenu;

	const attrs = getAttrs("sub-content");
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if asChild && $subOpen}
	<slot {builder} {attrs} />
{:else if transition && $subOpen}
	<div
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if inTransition && outTransition && $subOpen}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if inTransition && $subOpen}
	<div
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if outTransition && $subOpen}
	<div
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{:else if $subOpen}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
