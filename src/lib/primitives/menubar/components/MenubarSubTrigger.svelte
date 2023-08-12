<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";

	type $$Props = SubTriggerProps;
	type $$Events = SubTriggerEvents;
	const {
		elements: { subTrigger }
	} = ctx.getSub();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

<div
	use:melt={$subTrigger}
	{...$$restProps}
	on:m-click
	on:m-focusin
	on:m-focusout
	on:m-keydown
	on:m-pointerleave
	on:m-pointermove
	on:click
	on:keydown
>
	<slot />
</div>
