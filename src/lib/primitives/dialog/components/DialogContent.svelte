<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;

	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;
	const {
		elements: { content }
	} = ctx.get();
</script>

{#if transition}
	<div use:melt={$content} {...$$restProps} transition:transition={transitionConfig}>
		<slot />
	</div>
{:else}
	<div use:melt={$content} {...$$restProps}>
		<slot />
	</div>
{/if}
