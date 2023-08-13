<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";

	type $$Props = SubTriggerProps & {
		disabled?: boolean;
	};
	type $$Events = SubTriggerEvents;
	export let disabled = false;
	const {
		elements: { subTrigger }
	} = ctx.getSubTrigger();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
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
	{...disabledAttrs(disabled)}
>
	<slot />
</div>
