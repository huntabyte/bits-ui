<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Transition } from "$internal/index.js";

	import { ctx } from "../ctx.js";
	import type { SubContentEvents, SubContentProps } from "../types.js";
	type T = $$Generic<Transition>;
	type $$Props = SubContentProps<T>;
	type $$Events = SubContentEvents;

	export let transition: SubContentProps<T>["transition"] = undefined;
	export let transitionConfig: SubContentProps<T>["transitionConfig"] = undefined;
	export let asChild = false;

	const {
		elements: { subMenu },
		states: { subOpen }
	} = ctx.getSubContent();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->

{#if $subOpen}
	{#if asChild}
		<slot builder={$subMenu} />
	{:else if transition}
		<div
			use:melt={$subMenu}
			{...$$restProps}
			on:m-focusout
			on:m-keydown
			on:m-pointermove
			transition:transition={transitionConfig}
		>
			<slot builder={$subMenu} />
		</div>
	{:else}
		<div use:melt={$subMenu} {...$$restProps} on:m-focusout on:m-keydown on:m-pointermove>
			<slot builder={$subMenu} />
		</div>
	{/if}
{/if}
