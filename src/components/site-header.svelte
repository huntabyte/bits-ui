<script lang="ts">
	import { Button } from "$lib";
	import { LightSwitch, MobileNav } from "@/components";
	import { siteConfig } from "@/config";
	import { Logo } from "@/components/icons";
</script>

<header
	class="sticky top-0 z-50 overflow-x-hidden border-b border-border bg-background/75 backdrop-blur"
>
	<div class="container px-4">
		<div class="flex h-[70px] items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<MobileNav />
				<a
					href="/"
					class="ml-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<Logo />
				</a>
			</div>
			<div class="flex items-center justify-end gap-3">
				<Button.Root
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex h-10 items-center
					justify-center whitespace-nowrap rounded-[9px] bg-muted px-4
					text-sm font-semibold text-foreground shadow-mini ring-offset-background transition-colors hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					Report an issue
				</Button.Root>
				<LightSwitch />
			</div>
		</div>
	</div>
</header>
