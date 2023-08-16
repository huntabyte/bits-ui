<script lang="ts">
	import "../app.postcss";
	import { dev } from "$app/environment";
	import { SidebarNav, SiteHeader, TailwindIndicator } from "@/components";
	import { setInitialClassState } from "@/components/light-switch/light-switch";
</script>

<svelte:head>
	<!-- This causes the new eslint-plugin-svelte: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
	{@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<SiteHeader />
	<main class="min-h-[calc(100vh-16rem)]">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
			<div class="grid lg:grid-cols-10 lg:gap-8">
				<div class="lg:col-span-2">
					<SidebarNav />
				</div>
				<slot />
			</div>
		</div>
	</main>

	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
