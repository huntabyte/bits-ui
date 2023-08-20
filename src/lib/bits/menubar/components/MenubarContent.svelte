<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type $$Props = ContentProps;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 4;
	export let asChild = false;
	const {
		elements: { menu },
		states: { open }
	} = ctx.getContent(sideOffset);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if $open}
	{@const builder = $menu}
	{#if asChild}
		<slot {builder} />
	{:else}
		<div use:melt={builder} {...$$restProps} on:m-keydown>
			<slot {builder} />
		</div>
	{/if}
{/if}
