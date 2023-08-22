<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;
	type $$Props = SubContentProps<T, In, Out>;

	type $$Events = SubContentEvents;
	export let transition: SubContentProps<T, In, Out>["transition"] = undefined;
	export let transitionConfig: SubContentProps<T, In, Out>["transitionConfig"] = undefined;

	export let inTransition: SubContentProps<T, In, Out>["inTransition"] = undefined;
	export let inTransitionConfig: SubContentProps<T>["inTransitionConfig"] = undefined;

	export let outTransition: SubContentProps<T, In, Out>["outTransition"] = undefined;
	export let outTransitionConfig: SubContentProps<T, In, Out>["outTransitionConfig"] = undefined;
	export let asChild = false;

	const {
		elements: { subMenu },
		states: { subOpen }
	} = ctx.getSub();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if $subOpen}
	{@const builder = $subMenu}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
		>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps} on:m-focusout on:m-keydown on:m-pointermove>
			<slot {builder} />
		</div>
	{/if}
{/if}
