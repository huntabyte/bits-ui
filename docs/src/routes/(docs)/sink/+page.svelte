<script lang="ts">
	import Combobox from "./combobox.svelte";

	let myValue = $state("");
	const testItems = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
	];
</script>

<div class="mt-4">
	<button onclick={() => (myValue = "apple")}> Select Apple </button>
	<Combobox items={testItems} type="single" bind:value={myValue} />
</div>
