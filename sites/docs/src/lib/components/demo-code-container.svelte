<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div
	class="w-full [&_pre]:!my-0 [&_pre]:!mt-0 [&_pre]:max-h-[443px] [&_pre]:min-h-[443px] [&_pre]:overflow-auto [&_pre]:!rounded-card [&_pre]:!rounded-tl-none [&_pre]:!rounded-tr-none [&_pre]:!border-t-0"
>
	{@render children()}
</div>
