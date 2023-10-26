<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TitleProps } from "../types.js";

	type $$Props = TitleProps;
	export let level: TitleProps["level"] = "h2";
	export let asChild = false;
	const title = ctx.get().elements.title;

	$: builder = $title;
	const attrs = ctx.getAttrs("title");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<svelte:element this={level} use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</svelte:element>
{/if}
