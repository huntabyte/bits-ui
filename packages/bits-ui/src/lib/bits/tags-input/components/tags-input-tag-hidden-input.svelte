<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { useTagsInputTagHiddenInput } from "../tags-input.svelte.js";

	const hiddenInputState = useTagsInputTagHiddenInput();
	const mergedProps = $derived(mergeProps(hiddenInputState.props, {}));
</script>

{#if hiddenInputState.shouldRender}
	<input {...mergedProps} />
{/if}
