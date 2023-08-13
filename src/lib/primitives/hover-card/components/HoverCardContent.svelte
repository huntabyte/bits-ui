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
	export let asChild = false;

	const {
		elements: { content },
		states: { open }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if $open}
	{#if asChild}
		<slot builder={$content} />
	{:else if transition}
		<div
			use:melt={$content}
			{...$$restProps}
			on:m-focusout
			on:m-pointerdown
			on:m-pointerenter
			on:m-pointerleave
			transition:transition={transitionConfig}
		>
			<slot builder={$content} />
		</div>
	{:else}
		<div
			use:melt={$content}
			{...$$restProps}
			on:m-focusout
			on:m-pointerdown
			on:m-pointerenter
			on:m-pointerleave
		>
			<slot builder={$content} />
		</div>
	{/if}
{/if}
