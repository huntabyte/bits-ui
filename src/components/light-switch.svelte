<script lang="ts">
	import { Sun, MoonStars } from "phosphor-svelte";
	import { Button } from "$lib";
	import { toggleMode, mode } from "mode-watcher";
	import { scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
</script>

<Button.Root
	on:click={toggleMode}
	role="switch"
	aria-label="Light Switch"
	aria-checked={$mode === "light"}
	title="Toggle {$mode === 'dark' ? 'Dark' : 'Light'} Mode"
	class="relative inline-flex h-10 w-10 items-center justify-center rounded-input px-2 transition-colors hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
>
	{#if $mode === "light"}
		<div
			class="absolute inline-flex h-full w-full items-center justify-center"
			transition:scale={{
				delay: 50,
				duration: 200,
				start: 0.7,
				easing: cubicOut
			}}
		>
			<MoonStars class="sq-6" aria-label="Moon" />
		</div>
	{:else}
		<div
			class="absolute inline-flex h-full w-full items-center justify-center"
			transition:scale={{
				delay: 50,
				duration: 200,
				start: 0.7,
				easing: cubicOut
			}}
		>
			<Sun class="sq-6" aria-label="Sun" />
		</div>
	{/if}
</Button.Root>
