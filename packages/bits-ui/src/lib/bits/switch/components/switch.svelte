<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useSwitchRoot } from "../switch.svelte.js";
	import SwitchInput from "./switch-input.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		child,
		asChild,
		children,
		el = $bindable(),
		disabled = false,
		required = false,
		checked = false,
		value = "",
		name = undefined,
		type = "button",
		onCheckedChange,
		...restProps
	}: RootProps = $props();

	const state = useSwitchRoot({
		checked: box.with(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			}
		),
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		value: box.with(() => value),
		name: box.with(() => name),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: state.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

<SwitchInput />
