<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectHiddenInput } from "../select.svelte.js";
	import { HiddenInput } from "$lib/bits/utilities/hidden-input/index.js";

	let { value = $bindable("") }: { value?: string } = $props();

	const hiddenInputState = useSelectHiddenInput({
		value: box.with(() => value),
	});
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} bind:value />
{/if}
