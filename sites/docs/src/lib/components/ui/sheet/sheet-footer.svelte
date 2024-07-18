<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = {};
</script>

<div
	class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
	{...restProps}
>
	<slot />
</div>
