<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";

	type $$Props = SubTriggerProps;
	type $$Events = SubTriggerEvents;
	const {
		elements: { subTrigger }
	} = ctx.getSubTrigger();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt store -->
<div
	use:melt={$subTrigger}
	{...$$restProps}
	on:click
	on:keydown
	on:m-click
	on:m-focusin
	on:m-focusout
	on:m-keydown
	on:m-pointerleave
	on:m-pointermove
>
	<slot />
</div>
