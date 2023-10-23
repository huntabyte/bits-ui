<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

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
		states: { open }
	} = ctx.get();
</script>

{#if asChild && $open}
	{@const builder = $content}
	<slot {builder} />
{:else if transition && $open}
	{@const builder = $content}
	<div transition:transition={transitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	{@const builder = $content}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	{@const builder = $content}
	<div in:inTransition={inTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	{@const builder = $content}
	<div out:outTransition={outTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if $open}
	{@const builder = $content}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
