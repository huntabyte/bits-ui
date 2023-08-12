<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	const {
		elements: { trigger }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
<svelte:element
	this={"a"}
	use:melt={$trigger}
	{...$$restProps}
	on:m-blur
	on:m-focus
	on:m-pointerenter
	on:m-pointerleave
	on:m-touchstart
	on:click
	on:keydown
>
	<slot />
</svelte:element>
