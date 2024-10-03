<script lang="ts">
	import { Avatar } from "bits-ui";
</script>

<div class="mt-12 grid w-full justify-center gap-12">
	<Avatar.Root class="h-32 w-32">
		<Avatar.Image src="https://picsum.photos/200" alt="random-pic" crossorigin="anonymous" />
		<Avatar.Fallback>Not loaded</Avatar.Fallback>
	</Avatar.Root>

	<Avatar.Root class="h-32 w-32">
		<Avatar.Image
			src="https://github.com/huntabyte.png"
			alt="@huntabyte"
			crossorigin="anonymous"
		/>
		<Avatar.Fallback>Not loaded</Avatar.Fallback>
	</Avatar.Root>
</div>
