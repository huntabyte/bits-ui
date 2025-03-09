<script lang="ts">
	import { Avatar } from "bits-ui";
</script>

<Avatar.Root
	delayMs={200}
	class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border text-[17px] font-medium uppercase data-[status=loading]:border-transparent"
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
		<Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
	</div>
</Avatar.Root>
