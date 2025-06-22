<script lang="ts">
	import { TimeFieldHiddenInputState } from "../time-field.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const hiddenInputState = TimeFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
