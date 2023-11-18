<script lang="ts">
	import * as Separator from "@/components/ui/separator";
</script>

<div>
	<div class="space-y-1">
		<h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
		<p class="text-sm text-muted-foreground">
			An open-source UI component library.
		</p>
	</div>
	<Separator.Root class="my-4" />
	<div class="flex h-5 items-center space-x-4 text-sm">
		<div>Blog</div>
		<Separator.Root orientation="vertical" />
		<div>Docs</div>
		<Separator.Root orientation="vertical" />
		<div>Source</div>
	</div>
</div>
