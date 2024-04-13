<script lang="ts">
	import { getCheckboxInputState } from "../checkbox.svelte.js";

	const inputState = getCheckboxInputState();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} style="display: none !important;" />
{/if}
