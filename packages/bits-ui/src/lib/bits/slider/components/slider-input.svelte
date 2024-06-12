<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { InputProps } from "../index.js";
	import { srOnlyStyles, styleToString } from "$lib/internal/style.js";

	type $$Props = InputProps;
	export let el: $$Props["el"] = undefined;

	const {
		states: { value },
		getAttrs,
	} = getCtx();

	function getValue(value: number[]) {
		if (value.length === 1) {
			return value[0];
		} else if (value.length === 2) {
			//@ts-expect-error - we know these two exist and are numbers
			return value[1] - value[0];
		}
	}

	const attrs = {
		...getAttrs("input"),
		style: styleToString(srOnlyStyles),
	};

	$: inputValue = getValue($value);
</script>

<input bind:this={ref} {...$$restProps} value={inputValue} {...attrs} />
