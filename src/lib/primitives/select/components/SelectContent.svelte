<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$lib/internal/types.js";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";
	type T = $$Generic<Transition>;
	type $$Props = ContentProps<T>;
	type $$Events = ContentEvents;
	export let transition: ContentProps<T>["transition"] = undefined;
	export let transitionConfig: ContentProps<T>["transitionConfig"] = undefined;

	const {
		elements: { menu },
		states: { open }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if $open}
	{#if transition}
		<div
			use:melt={$menu}
			{...$$restProps}
			on:m-keydown
			on:keydown
			transition:transition={transitionConfig}
		>
			<slot />
		</div>
	{:else}
		<div use:melt={$menu} {...$$restProps} on:m-keydown on:keydown>
			<slot />
		</div>
	{/if}
{/if}
