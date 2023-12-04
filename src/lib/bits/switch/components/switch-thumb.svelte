<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ThumbProps } from "../types.js";

	type $$Props = ThumbProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		states: { checked }
	} = getCtx();

	$: attrs = {
		...getAttrs("thumb"),
		"data-state": $checked ? "checked" : "unchecked",
		"data-checked": $checked ? "" : undefined
	};

	$: slotProps = { checked: $checked, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<span {...$$restProps} {...attrs} />
{/if}
