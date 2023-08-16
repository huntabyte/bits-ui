<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { Xcom, GitHub } from "@/components/icons";
	import { LightSwitch } from "@/components";
	import { siteConfig } from "@/config";
</script>

<header class="bg-background/75 backdrop-blur border-b border-border -mb-px sticky top-0 z-50">
	<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
		<div class="flex items-center justify-between gap-3 h-16">
			<div class="flex items-center gap-1.5">
				<a href="/" class="font-bold leading-relaxed text-xl">Primitives</a>
			</div>
			<div class="items-center justify-end gap-1.5">
				<Button
					href={siteConfig.links.github}
					target="_blank"
					size="icon"
					variant="ghost"
					aria-label="View the github repo for this package."
					class=""
				>
					<GitHub class="sq-5" />
				</Button>
				<Button
					href={siteConfig.links.twitter}
					target="_blank"
					size="icon"
					variant="ghost"
					aria-label="X, formerly known as Twitter."
					class=""
				>
					<Xcom class="sq-5" />
				</Button>
				<LightSwitch />
			</div>
		</div>
	</div>
</header>
