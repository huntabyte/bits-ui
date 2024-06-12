<script lang="ts">
	import { useSwitchInput } from "../switch.svelte.js";
	import { srOnlyStyles, styleToString } from "$lib/internal/style.js";

	const inputState = useSwitchInput();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} style={styleToString(srOnlyStyles)} />
{/if}
