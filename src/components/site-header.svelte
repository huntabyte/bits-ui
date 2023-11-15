<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { LightSwitch, MobileNav } from "@/components";
	import { siteConfig } from "@/config";
</script>

<header class="bg-background/75 backdrop-blur border-b border-border -mb-px sticky top-0 z-50">
	<div class="container">
		<div class="flex items-center justify-between gap-3 h-[70px]">
			<div class="flex items-center gap-1.5">
				<MobileNav />
				<a href="/" class="font-bold tracking-tight text-2xl underline underline-offset-4">bits</a>
			</div>
			<div class="flex items-center justify-end gap-5">
				<Button
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					size="lg"
					aria-label="View the github repo for this package."
					class=""
				>
					Report an issue
				</Button>
				<LightSwitch />
			</div>
		</div>
	</div>
</header>
