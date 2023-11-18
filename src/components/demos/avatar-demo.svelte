<script lang="ts">
	import { Avatar } from "$lib";
</script>

<Avatar.Root
	class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-[17px] font-medium uppercase text-muted-foreground"
>
	<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
	<Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
