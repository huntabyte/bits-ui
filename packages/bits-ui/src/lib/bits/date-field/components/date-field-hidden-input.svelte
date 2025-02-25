<script lang="ts">
	import { useDateFieldHiddenInput } from "../date-field.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const hiddenInputState = useDateFieldHiddenInput();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
