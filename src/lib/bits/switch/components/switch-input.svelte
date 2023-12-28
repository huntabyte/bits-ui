<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { input },
		options: { value, name, disabled, required }
	} = getCtx();

	$: inputValue = $value === undefined || $value === "" ? "on" : $value;
</script>

<input
	bind:this={el}
	use:melt={$input}
	name={$name}
	disabled={$disabled}
	required={$required}
	value={inputValue}
	{...$$restProps}
/>
