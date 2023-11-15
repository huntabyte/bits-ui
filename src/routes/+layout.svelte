<script lang="ts">
	import { dev } from "$app/environment";
	import { SidebarNav, SiteHeader, TailwindIndicator } from "@/components";
	import { navigation } from "@/config";
	import { ModeWatcher } from "mode-watcher";
	import "@/styles/app.postcss";
</script>

<ModeWatcher />

<SiteHeader />
<main class="min-h-[calc(100vh-64px)]">
	<div
		class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
	>
		<SidebarNav items={navigation.sidebar} />
		<main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
			<div class="mx-auto w-full min-w-0">
				<slot />
			</div>

			<div class="hidden text-sm xl:block">
				<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6" />
			</div>
		</main>
	</div>
</main>

{#if dev}
	<TailwindIndicator />
{/if}
