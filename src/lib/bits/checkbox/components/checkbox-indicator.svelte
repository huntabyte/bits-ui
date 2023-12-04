<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;

	export let asChild: $$Props["asChild"] = false;

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

	$: slotProps = {
		isChecked: $isChecked,
		isIndeterminate: $isIndeterminate,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
