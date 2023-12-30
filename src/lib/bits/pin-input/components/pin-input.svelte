<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";
	import { derived } from "svelte/store";

	type $$Props = Props;

	export let placeholder: $$Props["placeholder"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let type: $$Props["type"] = "text";
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let id: $$Props["id"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption,
		ids
	} = setCtx({
		placeholder,
		defaultValue: value,
		name,
		disabled,
		type,
		onValueChange: ({ next }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		}
	});

	$: value !== undefined && localValue.set(value);

	const attrs = getAttrs("root");

	$: updateOption("placeholder", placeholder);
	$: updateOption("name", name);
	$: updateOption("disabled", disabled);
	$: updateOption("type", type);

	$: builder = $root;
	$: Object.assign(builder, attrs);

	const idValues = derived([ids.root], ([$menubarId]) => ({
		menubar: $menubarId
	}));

	$: if (id) {
		ids.root.set(id);
	}

	$: slotProps = {
		builder,
		ids: $idValues
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {...slotProps} />
	</div>
{/if}
