<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx } from "../ctx.js";
	import type { Events, Props } from "../index.js";
	import SwitchInput from "./switch-input.svelte";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;
	export let checked: $$Props["checked"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let includeInput: $$Props["includeInput"] = true;
	export let required: $$Props["required"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let inputAttrs: $$Props["inputAttrs"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { checked: localChecked },
		updateOption,
		getAttrs,
	} = setCtx({
		disabled,
		name,
		value,
		required,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			if (checked !== next) {
				checked = next;
				onCheckedChange?.(next);
			}
			return next;
		},
	});

	const dispatch = createDispatcher();

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption("disabled", disabled);
	$: updateOption("name", name);
	$: updateOption("value", value);
	$: updateOption("required", required);

	$: builder = $root;
	$: attrs = { ...getAttrs("root"), "data-checked": checked ? "" : undefined };
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
{#if includeInput}
	<SwitchInput {...inputAttrs} />
{/if}
