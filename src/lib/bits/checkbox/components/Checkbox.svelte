<script lang="ts">
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props, Events } from "../types.js";

	type $$Props = Props;
	type $$Events = Events;
	export let checked: $$Props["checked"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let required: $$Props["required"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let asChild = false;

	const {
		elements: { root },
		states: { checked: localChecked },
		updateOption
	} = ctx.set({
		defaultChecked: checked,
		disabled,
		name,
		required,
		value,
		onCheckedChange: ({ next }) => {
			onCheckedChange?.(next);
			checked = next;
			return next;
		}
	});

	const dispatch = createCustomEventDispatcher();

	$: checked !== undefined && localChecked.set(checked);

	$: updateOption("disabled", disabled);
	$: updateOption("name", name);
	$: updateOption("required", required);
	$: updateOption("value", value);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	{@const builder = $root}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch} on:m-keydown={dispatch}>
		<slot {builder} />
	</button>
{/if}
