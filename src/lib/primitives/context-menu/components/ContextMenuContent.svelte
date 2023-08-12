<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type $$Props = ContentProps;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 5;
	const {
		elements: { menu },
		states: { open }
	} = ctx.getContent(sideOffset);
</script>

{#if $open}
	<div use:melt={$menu} {...$$restProps} on:m-keydown>
		<slot />
	</div>
{/if}
