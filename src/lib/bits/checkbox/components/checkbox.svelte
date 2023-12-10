<script lang="ts">
	import type { Snippet } from "svelte";
	import { initCheckboxState } from "./state.svelte";
	import type { CheckboxProps } from "./types";

	let {
		asChild = false,
		checked = "indeterminate",
		disabled = false,
		onCheckedChange = undefined,
		required = false,
		children,
		onclick,
		onkeydown,
		...props
	} = $props<CheckboxProps & { children?: Snippet<CheckboxProps> }>();

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

{#if asChild && children}
	{@render children({ ...props, ...rootState.rootAttrs })}
{:else}
	<button
		type="button"
		{...props}
		{...rootState.rootAttrs}
		onclick={rootState.onclick}
		onkeydown={rootState.onkeydown}
	>
		{#if children}
			{@render children({ ...props, ...rootState.rootAttrs })}
		{/if}
	</button>
{/if}
