<script lang="ts">
	import type { ButtonRootProps } from "../types.js";

	let { href, disabled, type, children, ref = $bindable(), ...restProps }: ButtonRootProps = $props();

	const actualHref = $derived(disabled ? undefined : href);
</script>

<svelte:element
	this={actualHref ? "a" : "button"}
	type={actualHref ? undefined : type}
	href={actualHref}
	tabindex="0"
	bind:this={ref}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
