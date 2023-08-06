<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubContentProps } from "../types.js";

	type $$Props = SubContentProps;
	const { subContent, subOpen } = ctx.getSubContent();
</script>

{#if $subOpen}
	<div use:melt={$subContent} {...$$restProps}>
		<slot />
	</div>
{/if}
