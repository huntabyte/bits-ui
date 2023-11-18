<script lang="ts">
	import { Avatar } from "$lib";
	export let src: string;
</script>

<main>
	<Avatar.Root data-testid="root">
		<Avatar.Image {src} alt="huntabyte" data-testid="image" />
		<Avatar.Fallback data-testid="fallback">HJ</Avatar.Fallback>
	</Avatar.Root>

	<button on:click={() => (src = "")} data-testid="clear-button"
		>clear src</button
	>
</main>
