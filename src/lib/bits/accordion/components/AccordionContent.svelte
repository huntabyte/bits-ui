<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import type { ContentProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;

	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: ContentProps<T>["inTransitionConfig"] = undefined;

	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;

	export let asChild = false;

	const { content, isSelected, props } = ctx.getContent();
</script>

{#if $isSelected(props)}
	{@const builder = $content(props)}
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
		<div {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
