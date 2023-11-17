<script lang="ts">
	import { Avatar } from "$lib";
</script>

<Avatar.Root
	class="h-12 w-12 rounded-full bg-muted uppercase text-[17px] font-medium text-muted-foreground flex items-center justify-center"
>
	<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
	<Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
