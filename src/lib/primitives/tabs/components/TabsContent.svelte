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
	<div use:melt={$content(value)} {...$$restProps}>
		<slot builder={$content(value)} />
	</div>
{/if}
