<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";

	type $$Props = DescriptionProps;
	export let asChild = false;
	const description = ctx.get().elements.description;
	$: builder = $description;
	const attrs = ctx.getAttrs("description");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
