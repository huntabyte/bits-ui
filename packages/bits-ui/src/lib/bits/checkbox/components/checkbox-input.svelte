<script lang="ts">
	import { useCheckboxInput } from "../checkbox.svelte.js";

	const inputState = useCheckboxInput();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} type="checkbox" style="display: none !important;" />
{/if}
