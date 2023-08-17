<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";

	type $$Props = DescriptionProps;
	export let asChild = false;
	const description = ctx.get().elements.description;
</script>

{#if asChild}
	<slot builder={$description} />
{:else}
	<div use:melt={$description} {...$$restProps}>
		<slot builder={$description} />
	</div>
{/if}
