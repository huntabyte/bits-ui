<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";

	type $$Props = DescriptionProps;
	export let asChild = false;
	const {
		elements: { description }
	} = ctx.get();
</script>

{#if asChild}
	<slot builder={$description} />
{:else}
	{@const builder = $description}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
