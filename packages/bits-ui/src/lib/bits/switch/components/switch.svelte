<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SwitchRootProps } from "../types.js";
	import { useSwitchRoot } from "../switch.svelte.js";
	import SwitchInput from "./switch-input.svelte";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/callbacks.js";

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
		onCheckedChange = noop,
		controlledChecked = false,
		...restProps
	}: SwitchRootProps = $props();

	const rootState = useSwitchRoot({
		checked: box.with(
			() => checked,
			(v) => {
				if (controlledChecked) {
					onCheckedChange(v);
				} else {
					checked = v;
					onCheckedChange?.(v);
				}
			}
		),
		disabled: box.with(() => disabled ?? false),
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
	{@render child({ props: mergedProps, checked: rootState.checked.current })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ checked: rootState.checked.current })}
	</button>
{/if}

<SwitchInput />
