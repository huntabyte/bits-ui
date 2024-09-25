<script lang="ts">
	import type { Props } from "../index.js";

	let { href, type, children, ref, ...restProps }: Props = $props();
</script>

<svelte:element
	this={href ? "a" : "button"}
	type={href ? undefined : type}
	{href}
	tabindex="0"
	bind:this={ref}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
