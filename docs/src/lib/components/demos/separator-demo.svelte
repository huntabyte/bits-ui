<script lang="ts">
	import { Separator } from "bits-ui";
</script>

<div>
	<div class="space-y-1">
		<h4 class="font-semibold">Bits UI</h4>
		<p class="text-muted-foreground text-sm">Headless UI components for Svelte.</p>
	</div>
	<Separator.Root
		class="bg-border my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"
	/>
	<div class="flex h-5 items-center space-x-4 text-sm">
		<div>Blog</div>
		<Separator.Root
			orientation="vertical"
			class="bg-border my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"
		/>
		<div>Docs</div>
		<Separator.Root
			orientation="vertical"
			class="bg-border my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"
		/>
		<div>Source</div>
	</div>
</div>
