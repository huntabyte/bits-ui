<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerProps } from "../types.js";
	type $$Props = TriggerProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { trigger }
	} = ctx.get();
</script>

{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<button use:melt={$trigger({ value, disabled })} {...$$restProps}>
		<slot trigger={$trigger} />
	</button>
{/if}
