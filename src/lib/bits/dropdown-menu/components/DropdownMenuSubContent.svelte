<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher, type Transition } from "$lib/internal/index.js";
	import { getSubContent, getAttrs } from "../ctx.js";
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
	} = getSubContent();

	const dispatch = createDispatcher();
	const attrs = getAttrs("sub-content");

	$: if (id) {
		ids.menu.set(id);
	}
	$: builder = $subMenu;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild && $subOpen}
	<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
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
		<slot {...slotProps} />
	</div>
{/if}
