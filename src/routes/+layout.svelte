<script lang="ts">
	import { dev } from "$app/environment";
	import {
		Metadata,
		SidebarNav,
		SiteHeader,
		TableOfContents,
		TailwindIndicator
	} from "@/components";
	import { navigation } from "@/config";
	import { ModeWatcher } from "mode-watcher";
	import "@/styles/app.postcss";
	import { page } from "$app/stores";
	import { cn } from "@/utils";
</script>

<ModeWatcher />
<Metadata />

<SiteHeader />
<div class="min-h-[calc(100vh-64px)]">
	<div
		class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
	>
		<SidebarNav items={navigation.sidebar} />
		<main
			class={cn(
				"relative pb-6 pl-4 pr-4 pt-16 md:pl-0 lg:gap-10 xl:grid-cols-[1fr_220px]",
				$page.error ?? "xl:grid"
			)}
		>
			<div class="mx-auto w-full min-w-0 md:max-w-[700px]" id="content">
				<slot />
			</div>

			{#if !$page.error}
				<div class="hidden text-sm xl:block">
					<div
						class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6"
					>
						<TableOfContents />
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

{#if dev}
	<TailwindIndicator />
{/if}
