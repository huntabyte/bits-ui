<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;
	type $$Events = ContentEvents;

	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;
	export let sideOffset: ContentProps<T>["sideOffset"] = 4;
	export let asChild = false;

	const {
		elements: { content },
		states: { open }
	} = ctx.get(sideOffset);
</script>

{#if $open}
	{#if asChild}
		<slot builder={$content} />
	{:else if transition}
		<div
			use:melt={$content}
			transition:transition={transitionConfig}
			{...$$restProps}
			on:m-pointerdown
			on:m-pointerenter
		>
			<slot builder={$content} />
		</div>
	{:else}
		<div use:melt={$content} {...$$restProps} on:m-pointerdown on:m-pointerenter>
			<slot builder={$content} />
		</div>
	{/if}
{/if}
