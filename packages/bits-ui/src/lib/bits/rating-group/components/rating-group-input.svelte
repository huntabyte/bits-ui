<script lang="ts">
	import { useRatingGroupInput } from "../rating-group.svelte.js";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	const inputState = useRatingGroupInput();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
