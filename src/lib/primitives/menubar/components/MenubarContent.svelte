<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentEvents, ContentProps } from "../types.js";

	type $$Props = ContentProps;
	type $$Events = ContentEvents;
	export let sideOffset: $$Props["sideOffset"] = 4;
	const {
		elements: { menu }
	} = ctx.getContent(sideOffset);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

<div use:melt={$menu} {...$$restProps} on:m-keydown on:click on:keydown>
	<slot />
</div>
