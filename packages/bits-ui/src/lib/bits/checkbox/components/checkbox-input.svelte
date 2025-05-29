<script lang="ts">
	import { useCheckboxInput } from "../checkbox.svelte.js";
	import { HiddenInput } from "$lib/bits/utilities/hidden-input/index.js";

	const inputState = useCheckboxInput();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
