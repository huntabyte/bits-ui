<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ContentProps } from "../index.js";
	import { getContent } from "../ctx.js";
	import type { Transition } from "$lib/internal/index.js";

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
		propsStore,
		getAttrs,
	} = getContent();

	const attrs = getAttrs("content");

	$: builder = $content({ ...$propsStore });
	$: Object.assign(builder, attrs);
</script>

{#if asChild && $isSelected($propsStore.value)}
	<slot {builder} />
{:else if transition && $isSelected($propsStore.value)}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $isSelected($propsStore.value)}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $isSelected($propsStore.value)}
	<div bind:this={el} in:inTransition={inTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if outTransition && $isSelected($propsStore.value)}
	<div bind:this={el} out:outTransition={outTransitionConfig} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{:else if $isSelected($propsStore.value)}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
