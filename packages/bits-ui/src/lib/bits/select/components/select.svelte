<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectRootProps } from "../types.js";
	import { useSelectRoot } from "../select.svelte.js";
	import SelectNative from "./select-native.svelte";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		value = $bindable(""),
		children,
		onOpenChange = noop,
		onValueChange = noop,
		name = undefined,
		required = false,
		disabled = false,
		autocomplete = undefined,
		dir = "ltr",
		controlledOpen = false,
		controlledValue = false,
		form,
	}: SelectRootProps = $props();

	const rootState = useSelectRoot({
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange?.(v);
				}
			}
		),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange?.(v);
				}
			}
		),
		required: box.with(() => required),
		disabled: box.with(() => disabled),
		dir: box.with(() => dir),
	});
</script>

<FloatingLayer>
	{@render children?.()}
	{#if rootState.isFormControl.current}
		{#key rootState.nativeSelectKey}
			<SelectNative
				bind:value
				aria-hidden="true"
				tabindex={-1}
				{required}
				{name}
				{autocomplete}
				{disabled}
				{form}
				onchange={(e) => (value = e.currentTarget.value)}
			>
				{#if value === ""}
					<option value=""></option>
				{/if}
				{#each rootState.nativeOptionsArr as opt, idx (opt.current.key + idx)}
					<option
						value={opt.current.value}
						disabled={opt.current.disabled}
						selected={opt.current.value === rootState.value.current}
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html opt.current.innerHTML}
					</option>
				{/each}
			</SelectNative>
		{/key}
	{/if}
</FloatingLayer>
