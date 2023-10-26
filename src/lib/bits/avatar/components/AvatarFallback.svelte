<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { FallbackProps } from "../types.js";

	type $$Props = FallbackProps;
	export let asChild = false;
	const fallback = ctx.get().elements.fallback;
	$: builder = $fallback;
	const attrs = ctx.getAttrs("fallback");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</span>
{/if}
