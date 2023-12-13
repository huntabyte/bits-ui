<script lang="ts">
	import type { Snippet } from "svelte";
	import { getCheckboxState } from "./state.svelte";
	import type { CheckboxInputProps } from "./types";

	let { child, ...props } = $props<
		CheckboxInputProps & { children?: Snippet<CheckboxInputProps> }
	>();

	const rootState = getCheckboxState();
</script>

{#if props.asChild && child}
	{@render child({ ...props, ...rootState.inputAttrs })}
{:else}
	<input {...props} {...rootState.inputAttrs} />
{/if}
