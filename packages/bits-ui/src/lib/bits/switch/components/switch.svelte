<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useSwitchRoot } from "../switch.svelte.js";
	import SwitchInput from "./switch-input.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		disabled = false,
		required = false,
		checked = $bindable(false),
		value = "on",
		name = undefined,
		type = "button",
		onCheckedChange,
		...restProps
	}: RootProps = $props();

	const rootState = useSwitchRoot({
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
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props, { type }));
</script>

{#if child}
	{@render child?.({ props: mergedProps, checked: rootState.checked.current })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.({ checked: rootState.checked.current })}
	</button>
{/if}

<SwitchInput />
