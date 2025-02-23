<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { Button } from "bits-ui";
	import { scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import Moon from "phosphor-svelte/lib/Moon";
	import Sun from "phosphor-svelte/lib/Sun";

	let { children }: { children: Snippet } = $props();

	let theme = $state("light");

	onMount(() => {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		theme = systemTheme;
	});

	function toggleTheme() {
		theme = theme === "light" ? "dark" : "light";
		document.documentElement.setAttribute("class", theme);
	}
</script>

<div class={theme}>
	<div class="bg-background min-h-screen">
		<div class="fixed right-4 top-4">
			<Button.Root
				onclick={toggleTheme}
				role="switch"
				aria-label="Light Switch"
				aria-checked={theme === "light"}
				title="Toggle {theme === 'dark' ? 'Dark' : 'Light'} Mode"
				class="rounded-input hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex h-10 w-10 items-center justify-center px-2 focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				{#if theme === "light"}
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
		</div>
		<main class="flex min-h-screen items-center justify-center p-4">
			<div
				class="bg-card flex w-full max-w-3xl items-center justify-center rounded-lg border p-8 shadow-sm"
			>
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
