<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setCheckboxRootState } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		checked = $bindable(false),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name,
		value,
		el = $bindable(),
		asChild,
		child,
		...restProps
	}: RootProps = $props();

	const checkboxState = setCheckboxRootState({
		checked: box(
			() => checked,
			(v) => {
				if (checked !== v) {
					checked = v;
					onCheckedChange?.(v);
				}
			}
		),
		disabled: readonlyBox(() => disabled),
		required: readonlyBox(() => required),
		name: readonlyBox(() => name),
		value: readonlyBox(() => value),
	});

	const mergedProps = $derived(mergeProps({ ...restProps }, checkboxState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: checkboxState.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.({
			checked: checkboxState.checked.value,
		})}
	</button>
{/if}

<CheckboxInput />
