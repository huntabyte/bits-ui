<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type $$Props = SubContentProps;
	type $$Events = SubContentEvents;
	const {
		elements: { subMenu }
	} = ctx.getSub();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
<div
	use:melt={$subMenu}
	{...$$restProps}
	on:m-focusout
	on:m-keydown
	on:m-pointermove
	on:click
	on:keydown
>
	<slot />
</div>
