<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CheckboxItemEvents, CheckboxItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CheckboxItemProps;
	type $$Events = CheckboxItemEvents;
	export let checked: $$Props["checked"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild = false;

	const {
		elements: { checkboxItem },
		states: { checked: localChecked },
		updateOption
	} = ctx.setCheckboxItem({
		disabled,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			onCheckedChange?.(next);
			checked = next;
			return next;
		}
	});

	const dispatch = createDispatcher();

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption("disabled", disabled);
	$: builder = $checkboxItem;
	const attrs = ctx.getAttrs("checkbox-item");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
