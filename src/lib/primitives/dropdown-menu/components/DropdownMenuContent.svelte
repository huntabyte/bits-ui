<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	export let sideOffset: $$Props["sideOffset"] = 5;
	const { open, content } = ctx.getContent(sideOffset);
</script>

{#if $open}
	<div use:melt={$content} {...$$restProps}>
		<slot />
	</div>
{/if}
