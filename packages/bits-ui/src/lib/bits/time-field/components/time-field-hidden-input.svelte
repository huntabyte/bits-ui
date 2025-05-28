<script lang="ts">
	import { useTimeFieldHiddenInput } from "../time-field.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input/hidden-input.svelte";

	const hiddenInputState = useTimeFieldHiddenInput();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
