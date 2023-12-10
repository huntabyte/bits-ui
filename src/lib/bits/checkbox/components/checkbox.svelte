<script lang="ts">
	import { CheckboxState, setCheckboxRootContext } from "./state.svelte";
	import type { CheckboxRootProps } from "./types";

	let {
		asChild = false,
		checked = false,
		disabled = false,
		onCheckedChange = undefined,
		required = false,
		children,
		...props
	} = $props<CheckboxRootProps>();

	const rootState = new CheckboxState({
		checked: props.checked,
		disabled: props.disabled,
		onCheckedChange: props.onCheckedChange,
		required: props.required
	});

	setCheckboxRootContext(rootState);

	$effect(() => {
		rootState.checked = props.checked;
		rootState.disabled = props.disabled;
		rootState.onCheckedChange = props.onCheckedChange;
		rootState.required = props.required;
	});
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<button type="button" {...props}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
