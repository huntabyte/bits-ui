<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/types.js";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 5;
	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;
	export let asChild = false;

	const {
		elements: { menu },
		states: { open }
	} = ctx.getContent(sideOffset);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if $open}
	{#if asChild}
		<slot builder={$menu} />
	{:else if transition}
		<div use:melt={$menu} {...$$restProps} on:m-keydown transition:transition={transitionConfig}>
			<slot builder={$menu} />
		</div>
	{:else}
		<div use:melt={$menu} {...$$restProps} on:m-keydown>
			<slot builder={$menu} />
		</div>
	{/if}
{/if}
