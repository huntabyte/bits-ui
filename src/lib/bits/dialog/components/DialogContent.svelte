<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setTransitionTimes, type Transition } from "$lib/internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type T = $$Generic<Transition | null | undefined>;
	type In = $$Generic<Transition | null | undefined>;
	type Out = $$Generic<Transition | null | undefined>;

	type $$Props = ContentProps<T, In, Out>;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;

	export let asChild = false;

	const {
		elements: { content },
		transitionTimes,
		tOpen
	} = ctx.get();

	$: setTransitionTimes(transitionTimes, {
		transition,
		transitionConfig,
		inTransition,
		inTransitionConfig,
		outTransition,
		outTransitionConfig
	});
</script>

{#if asChild && $tOpen}
	{@const builder = $content}
	<slot {builder} />
{:else if transition && $tOpen}
	{@const builder = $content}
	<div transition:transition={transitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $tOpen}
	{@const builder = $content}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $tOpen}
	{@const builder = $content}
	<div in:inTransition={inTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if outTransition && $tOpen}
	{@const builder = $content}
	<div out:outTransition={outTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if $tOpen}
	{@const builder = $content}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
