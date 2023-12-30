<script lang="ts">
	import { builderActions, getAttrs } from "$lib/helpers/index.js";
	import type { Props, Events } from "../types.js";

	type $$Props = Props;
	type $$Events = Events;
	export let href: $$Props["href"] = undefined;
	export let type: $$Props["type"] = undefined;
	export let builders: $$Props["builders"] = [];
	export let el: $$Props["el"] = undefined;
	const attrs = {
		"data-button-root": ""
	};
</script>

{#if builders && builders.length}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svelte:element
		this={href ? "a" : "button"}
		bind:this={el}
		type={href ? undefined : type}
		{href}
		on:click
		on:change
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
		tabindex="0"
		use:builderActions={{ builders }}
		{...getAttrs(builders)}
		{...$$restProps}
		{...attrs}
	>
		<slot />
	</svelte:element>
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svelte:element
		this={href ? "a" : "button"}
		type={href ? undefined : type}
		{href}
		on:click
		on:change
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
		tabindex="0"
		{...$$restProps}
		{...attrs}
	>
		<slot />
	</svelte:element>
{/if}
