<script lang="ts">
	import { useSwitchInput } from "../switch.svelte.js";
	import { srOnlyStyles, styleToString } from "$lib/internal/style.js";

	const state = useSwitchInput();
</script>

{#if state.shouldRender}
	<input {...state.props} style={styleToString(srOnlyStyles)} />
{/if}
