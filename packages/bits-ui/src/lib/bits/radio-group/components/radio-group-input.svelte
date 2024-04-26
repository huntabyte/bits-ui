<script lang="ts">
	import { useRadioGroupInput } from "../radio-group.svelte.js";

	const state = useRadioGroupInput();
</script>

{#if state.shouldRender}
	<input {...state.props} />
{/if}
