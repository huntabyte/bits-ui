<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ThumbProps } from "../types.js";

	type $$Props = ThumbProps;
	export let asChild = false;
	const {
		states: { checked }
	} = getCtx();
	$: attrs = {
		...getAttrs("thumb"),
		"data-state": $checked ? "checked" : "unchecked",
		"data-checked": $checked ? "" : undefined
	};
</script>

{#if asChild}
	<slot checked={$checked} {attrs} />
{:else}
	<span {...$$restProps} {...attrs} />
{/if}
