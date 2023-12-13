<script lang="ts">
	import { initCheckboxState } from "./state.svelte";
	import type { CheckboxProps } from "./types";

	let {
		checked = "indeterminate",
		disabled = false,
		onCheckedChange = undefined,
		required = false,
		children,
		child,
		onclick,
		onkeydown,
		...props
	} = $props<CheckboxProps>();

	const rootState = initCheckboxState({
		checked,
		disabled,
		onCheckedChange,
		required,
		onclick,
		onkeydown
	});

	$effect(() => {
		rootState.checked = checked;
		rootState.disabled = disabled;
		rootState.onCheckedChange = onCheckedChange;
		rootState.required = required;
	});
</script>

{#if props.asChild && child}
	{@render child({
		...props,
		...rootState.rootAttrs,
		onclick: rootState.onclick,
		onkeydown: rootState.onkeydown
	})}
{:else}
	<button
		type="button"
		{...props}
		{...rootState.rootAttrs}
		onclick={rootState.onclick}
		onkeydown={rootState.onkeydown}
	>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
