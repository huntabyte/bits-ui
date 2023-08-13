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
	{#if $isSelected(props)}
		<div use:melt={$content(props)} transition:transition={transitionConfig} {...$$restProps}>
			<slot builder={$content(props)} />
		</div>
	{/if}
{:else if $isSelected(props)}
	<div use:melt={$content(props)} {...$$restProps}>
		<slot builder={$content(props)} />
	</div>
{/if}
