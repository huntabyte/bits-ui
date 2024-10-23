<script lang="ts">
	import type { ButtonRootProps } from "../types.js";

	let { href, type, children, ref = $bindable(), ...restProps }: ButtonRootProps = $props();
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
