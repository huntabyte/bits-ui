<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useSelectRoot } from "../select.svelte.js";
	import SelectNative from "./select-native.svelte";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = $bindable(false),
		value = $bindable(""),
		children,
		onOpenChange,
		onValueChange,
		name = undefined,
		required = false,
		disabled = false,
		autocomplete = undefined,
		dir = "ltr",
	}: RootProps = $props();

	const rootState = useSelectRoot({
		open: box.with(
			() => open,
			(v) => {
				if (open !== v) {
					open = v;
					onOpenChange?.(v);
				}
			}
		),
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
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

<FloatingLayer.Root>
	{@render children?.()}
	{#if rootState.isFormControl.value}
		{#key rootState.nativeSelectKey}
			<SelectNative
				bind:value
				aria-hidden="true"
				tabindex={-1}
				{required}
				{name}
				{autocomplete}
				{disabled}
				onchange={(e) => (value = e.currentTarget.value)}
			>
				{#if value === ""}
					<option value=""></option>
				{/if}
				{#each rootState.nativeOptionsArr as opt, idx (opt.value.key + idx)}
					<option
						value={opt.value.value}
						disabled={opt.value.disabled}
						selected={opt.value.value === rootState.value.value}
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html opt.value.innerHTML}
					</option>
				{/each}
			</SelectNative>
		{/key}
	{/if}
</FloatingLayer.Root>
