<script lang="ts">
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";
	import { useCheckboxInput } from "../checkbox.svelte.js";

	const inputState = useCheckboxInput();
</script>

{#if inputState.shouldRender}
	<VisuallyHidden>
		<input {...inputState.props} type="checkbox" style="display: none !important;" />
	</VisuallyHidden>
{/if}
