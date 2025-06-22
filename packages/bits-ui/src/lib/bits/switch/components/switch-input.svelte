<script lang="ts">
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";
	import { SwitchInputState } from "../switch.svelte.js";

	const inputState = SwitchInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
