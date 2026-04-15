<script lang="ts">
	import { SelectValueState } from "../select.svelte.js";
	import type { SelectValueProps } from "../types.js";

	let { child, ...restProps }: SelectValueProps = $props();

	const valueState = SelectValueState.create();
</script>

{#if child}
    {@render child({ ...valueState.snippetProps })}
{:else}
    <span {...restProps}>
        {#if valueState.snippetProps.type === 'single'}
            {valueState.snippetProps.selected.label}
        {:else}
            {valueState.snippetProps.selected.map((selected) => selected.label).join(', ')}
        {/if}
    </span>
{/if}
