<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { page } from "$app/stores";
	import { cn } from "$lib/utils/index.js";

	let {
		open = $bindable(false),
		href = "#",
		children,
		class: className,
		...restProps
	}: HTMLAnchorAttributes & { open: boolean } = $props();

	function close() {
		open = false;
	}

</script>

<a
	{href}
	onclick={close}
	class={cn($page.url.pathname === href ? "text-foreground" : "text-foreground/60", className)}
	{...restProps}
>
	{@render children?.()}
</a>
