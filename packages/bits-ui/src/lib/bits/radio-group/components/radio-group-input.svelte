<script lang="ts">
	import { getRadioGroupInputState } from "../radio-group.svelte.js";

	const inputState = getRadioGroupInputState();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} />
{/if}
