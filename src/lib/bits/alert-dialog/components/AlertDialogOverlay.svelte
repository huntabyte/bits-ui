<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { OverlayProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = OverlayProps<T, In, Out>;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;

	export let asChild = false;
	const {
		elements: { overlay },
		tOpen
	} = ctx.get();
</script>

{#if asChild && $tOpen}
	{@const builder = $overlay}
	<slot {builder} />
{:else if transition && $tOpen}
	{@const builder = $overlay}
	<div transition:transition={transitionConfig} use:melt={builder} {...$$restProps} />
{:else if inTransition && outTransition}
	{@const builder = $overlay}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if inTransition && $tOpen}
	{@const builder = $overlay}
	<div in:inTransition={inTransitionConfig} use:melt={builder} {...$$restProps} />
{:else if outTransition && $tOpen}
	{@const builder = $overlay}
	<div out:outTransition={outTransitionConfig} use:melt={builder} {...$$restProps} />
{:else if $tOpen}
	{@const builder = $overlay}
	<div use:melt={builder} {...$$restProps} />
{/if}
