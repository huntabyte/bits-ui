<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type $$Props = ContentProps;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 4;
	export let asChild = false;
	const menu = ctx.getContent(sideOffset).elements.menu;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$menu} />
{:else}
	<div use:melt={$menu} {...$$restProps} on:m-keydown>
		<slot builder={$menu} />
	</div>
{/if}
