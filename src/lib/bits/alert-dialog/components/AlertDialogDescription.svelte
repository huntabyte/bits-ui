<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";
	import { ATTRS } from "../attrs.js";

	type $$Props = DescriptionProps;
	export let asChild = false;
	const {
		elements: { description }
	} = ctx.get();

	$: builder = $description;
	const attrs = ATTRS.description;
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
