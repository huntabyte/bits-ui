<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

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
	{@const builder = $content}
	{#if asChild}
		<slot {builder} />
	{:else if transition}
		<div {...$$restProps} use:melt={builder} transition:transition={transitionConfig}>
			<slot {builder} />
		</div>
	{:else}
		<div use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
