<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import type { ContentProps } from "../types.js";
	import { getContent } from "../ctx.js";

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
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { content },
		helpers: { isSelected },
		props,
		getAttrs,
	} = getContent();

	const attrs = getAttrs("content");

	$: builder = $content(props);
	$: Object.assign(builder, attrs);
</script>

{#if $isSelected(props)}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div
			bind:this={el}
			transition:transition|global={transitionConfig}
			use:melt={builder}
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if inTransition && outTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if inTransition}
		<div
			bind:this={el}
			in:inTransition|global={inTransitionConfig}
			use:melt={builder}
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else if outTransition}
		<div
			bind:this={el}
			out:outTransition|global={outTransitionConfig}
			use:melt={builder}
			{...$$restProps}
		>
			<slot {builder} />
		</div>
	{:else}
		<div bind:this={el} use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
