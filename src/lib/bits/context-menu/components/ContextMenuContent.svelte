<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Transition } from "$internal/types.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 5;
	export let transition: $$Props["transition"] = undefined;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;

	export let asChild = false;
	const {
		elements: { menu },
		states: { open }
	} = ctx.getContent(sideOffset);
</script>

{#if $open}
	{@const builder = { ...$menu, "data-melt-context-menu-content": "" }}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div use:melt={builder} {...$$restProps} on:m-keydown transition:transition={transitionConfig}>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps} on:m-keydown>
			<slot {builder} />
		</div>
	{/if}
{/if}
