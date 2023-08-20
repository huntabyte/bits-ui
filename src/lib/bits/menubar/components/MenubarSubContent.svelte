<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";

	type $$Props = SubContentProps;
	type $$Events = SubContentEvents;
	export let asChild = false;
	const subMenu = ctx.getSub().elements.subMenu;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$subMenu} />
{:else}
	{@const builder = $subMenu}
	<div use:melt={builder} {...$$restProps} on:m-focusout on:m-keydown on:m-pointermove>
		<slot {builder} />
	</div>
{/if}
