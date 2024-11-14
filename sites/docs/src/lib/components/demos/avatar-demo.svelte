<script lang="ts">
	import { Avatar } from "bits-ui";

	let loadingStatus = $state<Avatar.RootProps["loadingStatus"]>("loading");
	let src = $state<string | null>("/avatar-1.png");
</script>

<button onclick={() => (src = null)}> Remove src </button>
<Avatar.Root
	bind:loadingStatus
	class="h-12 w-12 rounded-full border {loadingStatus === 'loaded'
		? 'border-foreground'
		: 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image {src} alt="@huntabyte" />
		<Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
	</div>
</Avatar.Root>
