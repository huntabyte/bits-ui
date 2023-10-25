<script lang="ts">
	import { dev } from "$app/environment";
	import { SidebarNav, SiteHeader, TailwindIndicator } from "@/components";
	import { setInitialClassState } from "@/components/light-switch/light-switch";
	import { navigation } from "@/config";
	import "@/styles/app.postcss";
</script>

<svelte:head>
	<!-- This causes the new eslint-plugin-svelte: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
	{@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<SiteHeader />
<main class="min-h-[calc(100vh-64px)]">
	<div class="mx-auto px-4 container">
		<div class="lg:grid lg:grid-cols-12">
			<div class="lg:col-span-2 border-r border-border">
				<SidebarNav items={navigation.sidebar} />
			</div>
			<div class="lg:col-span-10 lg:col-start-4">
				<div class="lg:grid lg:grid-cols-9 lg:gap-6">
					<div class="lg:col-span-7">
						<slot />
					</div>
					<div class="lg:col-span-2 lg:col-start-11 order-first lg:order-last" />
				</div>
			</div>
		</div>
	</div>
</main>

{#if dev}
	<TailwindIndicator />
{/if}
