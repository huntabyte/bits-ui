<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerProps } from "../types.js";
	type $$Props = TriggerProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;

	const {
		elements: { trigger }
	} = ctx.get();
</script>

<button use:melt={$trigger({ value, disabled })} {...$$restProps}>
	<slot />
</button>
