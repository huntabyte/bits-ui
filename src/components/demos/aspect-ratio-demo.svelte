<script lang="ts">
	import { AspectRatio } from "$lib";
</script>

<AspectRatio.Root ratio={16 / 9} class="scale-80 rounded-[15px] bg-transparent">
	<img
		src="/abstract.png"
		alt="an abstract painting"
		class="h-full w-full rounded-[15px] object-cover"
	/>
</AspectRatio.Root>
