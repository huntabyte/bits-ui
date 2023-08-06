<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;

	const { item } = ctx.setItem(value);
</script>

<button use:melt={$item({ value, disabled })} {...$$restProps}>
	<slot />
</button>
