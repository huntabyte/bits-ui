<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import { getCtx, getAttrs } from "../ctx.js";
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
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { overlay },
		states: { open }
	} = getCtx();
	const attrs = getAttrs("overlay");

	$: builder = $overlay;
	$: Object.assign(builder, attrs);
</script>

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if inTransition && outTransition && $open}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if inTransition && $open}
	<div
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if outTransition && $open}
	<div
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if $open}
	<div use:melt={builder} {...$$restProps} />
{/if}
