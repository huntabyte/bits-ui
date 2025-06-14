<script lang="ts">
	import { DateFieldHiddenInputState } from "../date-field.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const hiddenInputState = DateFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
