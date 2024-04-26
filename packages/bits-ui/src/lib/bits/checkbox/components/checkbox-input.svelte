<script lang="ts">
	import { useCheckboxInput } from "../checkbox.svelte.js";

	const state = useCheckboxInput();
</script>

{#if state.shouldRender}
	<input {...state.props} type="checkbox" style="display: none !important;" />
{/if}
