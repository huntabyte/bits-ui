<script lang="ts">
	import type { Snippet } from "svelte";
	import { initCheckboxState } from "./state.svelte";
	import type { CheckboxProps } from "./types";

	type AsChildProps = Omit<CheckboxProps, "children" | "asChild"> & {
		child: Snippet<CheckboxProps>;
		children?: never;
		asChild: true;
	};

	type DefaultProps = Omit<CheckboxProps, "asChild"> & {
		asChild?: never;
		child?: never;
	};

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
	} = $props<AsChildProps | DefaultProps>();

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
	{@render child({ ...props, ...rootState.rootAttrs })}
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
