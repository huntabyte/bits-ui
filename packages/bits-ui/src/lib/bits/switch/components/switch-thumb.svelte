<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { ThumbProps } from "../index.js";

	type $$Props = ThumbProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		states: { checked },
		getAttrs,
	} = getCtx();

	$: attrs = {
		...getAttrs("thumb"),
		"data-state": $checked ? "checked" : "unchecked",
		"data-checked": $checked ? "" : undefined,
	};
</script>

{#if asChild}
	<slot {attrs} checked={$checked} />
{:else}
	<span bind:this={el} {...$$restProps} {...attrs}></span>
{/if}
