<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { TagsInputTagHiddenInputState } from "../tags-input.svelte.js";

	const hiddenInputState = TagsInputTagHiddenInputState.create();
	const mergedProps = $derived(mergeProps(hiddenInputState.props, {}));
</script>

{#if hiddenInputState.shouldRender}
	<input {...mergedProps} />
{/if}
