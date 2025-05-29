<script lang="ts">
	import { useRatingGroupHiddenInput } from "../rating-group.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const inputState = useRatingGroupHiddenInput();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
