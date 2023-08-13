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
		<div use:melt={$content} transition:transition={transitionConfig} {...$$restProps}>
			<slot builder={$content} />
		</div>
	{:else}
		<div use:melt={$content} {...$$restProps}>
			<slot builder={$content} />
		</div>
	{/if}
{/if}
