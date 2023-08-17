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
	const content = ctx.get().elements.content;
</script>

{#if asChild}
	<slot builder={$content} />
{:else if transition}
	<div use:melt={$content} {...$$restProps} transition:transition={transitionConfig}>
		<slot builder={$content} />
	</div>
{:else}
	<div use:melt={$content} {...$$restProps}>
		<slot builder={$content} />
	</div>
{/if}
