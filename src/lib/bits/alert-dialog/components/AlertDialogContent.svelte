<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setTransitionTimes, type Transition } from "$internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;

	export let transition: ContentProps<T, In, Out>["transition"] = undefined;
	export let transitionConfig: ContentProps<T, In, Out>["transitionConfig"] = undefined;
	export let inTransition: ContentProps<T, In, Out>["inTransition"] = undefined;
	export let inTransitionConfig: ContentProps<T, In, Out>["inTransitionConfig"] = undefined;
	export let outTransition: ContentProps<T, In, Out>["outTransition"] = undefined;
	export let outTransitionConfig: ContentProps<T, In, Out>["outTransitionConfig"] = undefined;

	export let asChild = false;

	const {
		elements: { content },
		states: { open },
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

{#if $tOpen}
	{@const builder = $content}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div transition:transition|global={transitionConfig} use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div in:inTransition|global={inTransitionConfig} use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div out:outTransition|global={outTransitionConfig} use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
