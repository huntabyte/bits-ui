<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	const {
		states: { value }
	} = ctx.get();

	function getValue(value: number[]) {
		if (value.length === 1) {
			return value[0];
		} else {
			return value[1] - value[0];
		}
	}
	$: inputValue = getValue($value);
</script>

<input {...$$restProps} value={inputValue} hidden />
