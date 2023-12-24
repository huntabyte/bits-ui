<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/index.js";
	import type { ContentProps } from "../types.js";
	import { getContent, getAttrs } from "../ctx.js";

	type T = $$Generic<Transition>;
	type In = $$Generic<Transition>;
	type Out = $$Generic<Transition>;

	type $$Props = ContentProps<T, In, Out>;

	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let inTransition: $$Props["inTransition"] = undefined;
	export let inTransitionConfig: ContentProps<T>["inTransitionConfig"] =
		undefined;
	export let outTransition: $$Props["outTransition"] = undefined;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { content, isSelected, props } = getContent();

	const attrs = getAttrs("content");

	$: builder = $content(props);
	$: Object.assign(builder, attrs);
</script>

{#if asChild && $isSelected(props)}
	<slot {builder} />
{:else if transition && $isSelected(props)}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $isSelected(props)}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $isSelected(props)}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $isSelected(props)}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if $isSelected(props)}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
