<script lang="ts">
	import { Button } from "bits-ui";
	import { mode, toggleMode } from "mode-watcher";
	import { scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import Moon from "phosphor-svelte/lib/Moon";
	import Sun from "phosphor-svelte/lib/Sun";
</script>

<Button.Root
	onclick={toggleMode}
	role="switch"
	aria-label="Light Switch"
	aria-checked={mode.current === "light"}
	title="Toggle {mode.current === 'dark' ? 'Dark' : 'Light'} Mode"
	class="rounded-input hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex h-10 w-10 cursor-pointer items-center justify-center px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
>
	{#if mode.current === "light"}
		<div
			class="absolute inline-flex h-full w-full items-center justify-center"
			transition:scale={{
				delay: 50,
				duration: 200,
				start: 0.7,
				easing: cubicOut,
			}}
		>
			<Moon class="size-6" aria-label="Moon" />
		</div>
	{:else}
		<div
			class="absolute inline-flex h-full w-full items-center justify-center"
			transition:scale={{
				delay: 50,
				duration: 200,
				start: 0.7,
				easing: cubicOut,
			}}
		>
			<Sun class="size-6" aria-label="Sun" />
		</div>
	{/if}
</Button.Root>
