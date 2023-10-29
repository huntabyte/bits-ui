<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		elements: { input },
		options: { value, name, disabled, required }
	} = getCtx();

	$: inputValue = $value === undefined || $value === "" ? "on" : $value;
</script>

<input
	use:melt={$input}
	name={$name}
	disabled={$disabled}
	required={$required}
	value={inputValue}
	{...$$restProps}
/>
