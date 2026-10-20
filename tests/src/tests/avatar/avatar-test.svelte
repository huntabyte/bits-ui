<script lang="ts">
	import { Avatar, type AvatarRootProps } from "bits-ui";
	let { src, ...rootProps }: { src: string } & AvatarRootProps = $props();
</script>

<main>
	<Avatar.Root {...rootProps} data-testid="root">
		<Avatar.Image {src} alt="huntabyte" data-testid="image" />
		<Avatar.Fallback data-testid="fallback">HJ</Avatar.Fallback>
	</Avatar.Root>

	<button onclick={() => (src = "")} data-testid="clear-button">clear src</button>
</main>
