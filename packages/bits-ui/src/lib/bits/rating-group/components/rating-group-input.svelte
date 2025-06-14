<script lang="ts">
	import { RatingGroupHiddenInputState } from "../rating-group.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const inputState = RatingGroupHiddenInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
