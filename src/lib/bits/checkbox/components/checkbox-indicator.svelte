<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		helpers: { isChecked, isIndeterminate },
		states: { checked }
	} = getCtx();

	function getStateAttr(state: boolean | "indeterminate") {
		if (state === "indeterminate") return "indeterminate";
		if (state) return "checked";
		return "unchecked";
	}

	$: attrs = {
		...getAttrs("indicator"),
		"data-state": getStateAttr($checked)
	};
</script>

{#if asChild}
	<slot {attrs} isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
	</div>
{/if}
