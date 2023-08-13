<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { trigger }
	} = ctx.get();
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	<button use:melt={$trigger} {...$$restProps} on:m-click on:m-keydown>
		<slot builder={$trigger} />
	</button>
{/if}
