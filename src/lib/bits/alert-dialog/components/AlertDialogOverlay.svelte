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

{#if $tOpen}
	{@const builder = $overlay}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div transition:transition|global={transitionConfig} use:melt={builder} {...$$restProps} />
	{:else if inTransition && outTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
		/>
	{:else if inTransition}
		<div in:inTransition|global={inTransitionConfig} use:melt={builder} {...$$restProps} />
	{:else if outTransition}
		<div out:outTransition|global={outTransitionConfig} use:melt={builder} {...$$restProps} />
	{:else}
		<div use:melt={builder} {...$$restProps} />
	{/if}
{/if}
