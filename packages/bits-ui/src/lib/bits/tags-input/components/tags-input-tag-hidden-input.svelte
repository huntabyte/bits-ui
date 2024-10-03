<script lang="ts">
	import { useTagsInputTagHiddenInput } from "../tags-input.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	const hiddenInputState = useTagsInputTagHiddenInput();
	const mergedProps = $derived(mergeProps(hiddenInputState.props, {}));
</script>

{#if hiddenInputState.shouldRender}
	<input {...mergedProps} />
{/if}
