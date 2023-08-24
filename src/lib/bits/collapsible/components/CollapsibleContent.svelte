<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/types.js";
	import type { ContentProps } from "../types.js";
	import { ctx } from "../ctx.js";

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

{#if $open}
	{@const builder = $content}
	{#if asChild}
		<slot builder={$content} />
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
