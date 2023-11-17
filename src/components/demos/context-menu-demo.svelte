<script lang="ts">
	import { ContextMenu } from "$lib";
	import { flyAndScale } from "@/utils";
	import { PencilSimpleLine, PlusCircle, CopySimple, Trash } from "phosphor-svelte";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-[150px] w-[300px] items-center justify-center rounded-card-sm text-sm font-medium bg-muted select-none"
	>
		Right click me
	</ContextMenu.Trigger>
	<ContextMenu.Content
		class="max-w-[229px] w-full rounded-xl border border-muted shadow-popover px-1 py-1.5 bg-background outline-none"
		transition={flyAndScale}
	>
		<ContextMenu.Item
			class="data-[highlighted]:bg-muted text-sm font-medium flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
		>
			<div class="flex items-center">
				<PencilSimpleLine class="mr-2 h-4 w-4 text-foreground-alt" />
				Edit
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-xs bg-background"
				>
					⌘
				</kbd>
				<kbd
					class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-[10px] bg-background"
				>
					E
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger
				class="data-[highlighted]:bg-muted text-sm font-medium flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
			>
				<div class="flex items-center">
					<PlusCircle class="mr-2 h-4 w-4 text-foreground-alt" />
					Add
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-xs bg-background"
					>
						⌘
					</kbd>
					<kbd
						class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-[10px] bg-background"
					>
						N
					</kbd>
				</div>
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent
				class="max-w-[209px] w-full rounded-xl border border-muted shadow-popover px-1 py-1.5 bg-background outline-none"
				transition={flyAndScale}
			>
				<ContextMenu.Item
					class="data-[highlighted]:bg-muted text-sm font-normal flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
				>
					Header
				</ContextMenu.Item>
				<ContextMenu.Item
					class="data-[highlighted]:bg-muted text-sm font-normal flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
				>
					Paragraph
				</ContextMenu.Item>
				<ContextMenu.Item
					class="data-[highlighted]:bg-muted text-sm font-normal flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
				>
					Codeblock
				</ContextMenu.Item>
				<ContextMenu.Item
					class="data-[highlighted]:bg-muted text-sm font-normal flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
				>
					List
				</ContextMenu.Item>
				<ContextMenu.Item
					class="data-[highlighted]:bg-muted text-sm font-normal flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
				>
					Task
				</ContextMenu.Item>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Item
			class="data-[highlighted]:bg-muted text-sm font-medium flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
		>
			<div class="flex items-center">
				<CopySimple class="mr-2 h-4 w-4 text-foreground-alt" />
				Duplicate
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-xs bg-background"
				>
					⌘
				</kbd>
				<kbd
					class="h-5 w-5 rounded-button border border-dark-10 shadow-kbd inline-flex items-center justify-center text-muted-foreground text-[10px] bg-background"
				>
					D
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Separator class="w-full bg-muted h-px my-1 -mx-1" />
		<ContextMenu.Item
			class="data-[highlighted]:bg-muted text-sm font-medium flex items-center py-3 pl-3 pr-1.5 h-10 rounded-button select-none transition-all outline-none duration-75"
		>
			<div class="flex items-center">
				<Trash class="mr-2 h-4 w-4 text-foreground-alt" />
				Delete
			</div>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
