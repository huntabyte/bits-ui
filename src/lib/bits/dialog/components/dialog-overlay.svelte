<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { OverlayEvents, OverlayProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = OverlayProps<T, In, Out>;
	type $$Events = OverlayEvents;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

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
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:mouseup
		bind:this={el}
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if inTransition && outTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		on:mouseup
		{...$$restProps}
	/>
{:else if inTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		on:mouseup
		{...$$restProps}
	/>
{:else if outTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		on:mouseup
		{...$$restProps}
	/>
{:else if $open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div bind:this={el} use:melt={builder} on:mouseup {...$$restProps} />
{/if}
