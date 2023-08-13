<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { FallbackProps } from "../types.js";

	type $$Props = FallbackProps;
	export let asChild = false;
	const fallback = ctx.get().elements.fallback;
</script>

{#if asChild}
	<slot builder={$fallback} />
{:else}
	<span use:melt={$fallback} {...$$restProps}>
		<slot builder={$fallback} />
	</span>
{/if}
