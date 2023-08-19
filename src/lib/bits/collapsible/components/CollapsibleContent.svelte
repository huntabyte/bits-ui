<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ContentProps } from "../types.js";
	import { ctx } from "../ctx.js";
	import type { Transition } from "$internal/types.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;

	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;
	export let asChild = false;
	const {
		elements: { content },
		states: { open }
	} = ctx.get();
</script>

{#if $open}
	{#if asChild}
		<slot builder={$content} />
	{:else if transition}
		{@const builder = $content}
		<div use:melt={builder} transition:transition={transitionConfig} {...$$restProps}>
			<slot {builder} />
		</div>
	{:else}
		{@const builder = $content}
		<div use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
