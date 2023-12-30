<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";
	import SwitchInput from "./switch-input.svelte";

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
		updateOption
	} = setCtx({
		disabled,
		name,
		value,
		required,
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
