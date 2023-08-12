<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type $$Props = SubContentProps;
	type $$Events = SubContentEvents;
	const {
		elements: { subMenu },
		states: { subOpen }
	} = ctx.getSubContent();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
{#if $subOpen}
	<div
		use:melt={$subMenu}
		{...$$restProps}
		on:click
		on:keydown
		on:m-focusout
		on:m-keydown
		on:m-pointermove
	>
		<slot />
	</div>
{/if}
