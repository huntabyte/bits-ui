<script lang="ts">
	import * as Collapsible from "@/components/ui/collapsible";
	import * as Button from "@/components/ui/button";
	import { CaretUpDown } from "@/components/icons";
</script>

<Collapsible.Root class="w-[350px] space-y-2">
	<div class="flex items-center justify-between space-x-4 px-4">
		<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger asChild let:builder>
			<Button.Root
				builders={[builder]}
				variant="ghost"
				size="sm"
				class="w-9 p-0"
			>
				<CaretUpDown class="h-4 w-4" />
				<span class="sr-only">Toggle</span>
			</Button.Root>
		</Collapsible.Trigger>
	</div>
	<div class="rounded-md border px-4 py-3 font-mono text-sm">
		@huntabyte/bits
	</div>
	<Collapsible.Content class="space-y-2">
		<div class="rounded-md border px-4 py-3 font-mono text-sm">
			@melt-ui/melt
		</div>
		<div class="rounded-md border px-4 py-3 font-mono text-sm">
			@huntabyte/shadcn-svelte
		</div>
	</Collapsible.Content>
</Collapsible.Root>
