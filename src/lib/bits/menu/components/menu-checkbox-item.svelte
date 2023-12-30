<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCheckboxItem, getAttrs } from "../ctx.js";
	import type { CheckboxItemEvents, CheckboxItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CheckboxItemProps;
	type $$Events = CheckboxItemEvents;

	export let checked: $$Props["checked"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { checkboxItem },
		states: { checked: localChecked },
		updateOption
	} = setCheckboxItem({
		disabled,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			if (checked !== next) {
				onCheckedChange?.(next);
				checked = next;
			}
			return next;
		}
	});

	const dispatch = createDispatcher();
	const attrs = getAttrs("checkbox-item");

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption("disabled", disabled);

	$: builder = $checkboxItem;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
