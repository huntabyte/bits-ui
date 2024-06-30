<script lang="ts">
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";
	import { useDateFieldHiddenInput } from "../date-field.svelte.js";

	const hiddenInputState = useDateFieldHiddenInput();
</script>

{#if hiddenInputState.shouldRender}
	<VisuallyHidden asChild>
		{#snippet child({ props })}
			<input {...props} {...hiddenInputState.props} />
		{/snippet}
	</VisuallyHidden>
{/if}
