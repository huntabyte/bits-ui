<script lang="ts">
	import { useRatingGroupInput } from "../rating-group.svelte.js";

	const inputState = useRatingGroupInput();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} />
{/if}
