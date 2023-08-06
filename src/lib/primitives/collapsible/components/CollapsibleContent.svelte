<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ContentProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;

	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;

	const {
		elements: { content },
		states: { open }
	} = ctx.get();
</script>

{#if transition}
	{#if $open}
		<div use:melt={$content} transition:transition={transitionConfig} {...$$restProps}>
			<slot />
		</div>
	{/if}
{:else if $open}
	<div use:melt={$content} {...$$restProps}>
		<slot />
	</div>
{/if}
