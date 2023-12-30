<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props, Events } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;
	export let checked: $$Props["checked"] = false;
	export let disabled: $$Props["disabled"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let required: $$Props["required"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { checked: localChecked },
		updateOption
	} = setCtx({
		defaultChecked: checked,
		disabled,
		name,
		required,
		value,
		onCheckedChange: ({ next }) => {
			if (checked !== next) {
				onCheckedChange?.(next);
				checked = next;
			}
			return next;
		}
	});

	const dispatch = createDispatcher();

	$: attrs = { ...getAttrs("root"), disabled: disabled ? true : undefined };
	$: checked !== undefined && localChecked.set(checked);

	$: updateOption("disabled", disabled);
	$: updateOption("name", name);
	$: updateOption("required", required);
	$: updateOption("value", value);

	$: builder = $root;
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
