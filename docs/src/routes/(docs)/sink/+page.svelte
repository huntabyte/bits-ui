<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<div class="flex flex-col">
	{#each { length: 50 } as _, i (i)}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="rounded-card border-border-input text-muted-foreground flex select-none items-center justify-center border-2 border-dashed bg-transparent font-semibold"
			>
				<div class="flex flex-col items-center justify-center gap-4 text-center">
					Right click me {i}
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content
					class="border-muted bg-background shadow-popover w-[229px] rounded-xl border px-1 py-1.5 outline-none focus-visible:outline-none"
				>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
					>
						{i}
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	{/each}
</div>
