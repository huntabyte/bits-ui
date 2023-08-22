<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	export let value: $$Props["value"];
	export let asChild = false;
	const content = ctx.get().elements.content;
</script>

{#if asChild}
	<slot builder={$content(value)} />
{:else}
	{@const builder = $content(value)}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
