<script lang="ts">
	import { ATTRS } from "../attrs.js";

	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
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

	$: builder = $overlay;
	const attrs = ATTRS.overlay;
</script>

{#if asChild && $tOpen}
	<slot {builder} {attrs} />
{:else if transition && $tOpen}
	<div transition:transition={transitionConfig} use:melt={builder} {...$$restProps} {...attrs} />
{:else if inTransition && outTransition && $tOpen}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	/>
{:else if inTransition && $tOpen}
	<div in:inTransition={inTransitionConfig} use:melt={builder} {...$$restProps} {...attrs} />
{:else if outTransition && $tOpen}
	<div out:outTransition={outTransitionConfig} use:melt={builder} {...$$restProps} {...attrs} />
{:else if $tOpen}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
