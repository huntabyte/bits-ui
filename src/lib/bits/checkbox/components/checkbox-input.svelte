<script lang="ts">
	import type { Snippet } from "svelte";
	import { getCheckboxState } from "./state.svelte";
	import type { CheckboxInputProps } from "./types";

	let {
		asChild = false,
		children,
		...props
	} = $props<CheckboxInputProps & { children?: Snippet<CheckboxInputProps> }>();

	const rootState = getCheckboxState();
</script>

{#if asChild && children}
	{@render children({ ...props, ...rootState.inputAttrs })}
{:else}
	<input {...props} {...rootState.inputAttrs} />
{/if}
