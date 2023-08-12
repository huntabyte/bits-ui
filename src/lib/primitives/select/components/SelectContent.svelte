<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type $$Props = ContentProps;
	type $$Events = ContentEvents;
	const {
		elements: { menu },
		states: { open }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if $open}
	<div use:melt={$menu} {...$$restProps} on:m-keydown on:keydown>
		<slot />
	</div>
{/if}
