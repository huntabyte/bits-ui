<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TitleProps } from "../types.js";

	type $$Props = TitleProps;
	export let level: TitleProps["level"] = "h2";
	const {
		elements: { title }
	} = ctx.get();
</script>

<svelte:element this={level} use:melt={$title} {...$$restProps}>
	<slot />
</svelte:element>
