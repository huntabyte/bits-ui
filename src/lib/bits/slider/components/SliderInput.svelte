<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";
	import { srOnlyStyles } from "$lib/internal/style.js";

	type $$Props = InputProps;

	const {
		states: { value }
	} = getCtx();

	function getValue(value: number[]) {
		if (value.length === 1) {
			return value[0];
		} else {
			return value[1] - value[0];
		}
	}

	const attrs = {
		...getAttrs("input"),
		style: srOnlyStyles
	};

	$: inputValue = getValue($value);
</script>

<input {...$$restProps} value={inputValue} {...attrs} />
