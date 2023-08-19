<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";
	import type { ContentProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;

	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;
	export let asChild: ContentProps<T>["asChild"] = false;

	const { content, isSelected, props } = ctx.getContent();
</script>

{#if asChild}
	{#if $isSelected(props)}
		<slot builder={$content(props)} />
	{/if}
{:else if transition}
	{@const builder = $content(props)}
	{#if $isSelected(props)}
		<div use:melt={builder} transition:transition={transitionConfig} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{:else if $isSelected(props)}
	{@const builder = $content(props)}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
