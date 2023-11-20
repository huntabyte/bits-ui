<script lang="ts">
	import { ContextMenu } from "$lib";
	import { flyAndScale } from "@/utils";
	import {
		PencilSimpleLine,
		PlusCircle,
		CopySimple,
		Trash
	} from "phosphor-svelte";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-[150px] w-[300px] select-none items-center justify-center rounded-card-sm bg-muted text-sm font-medium"
	>
		Right click me
	</ContextMenu.Trigger>
	<ContextMenu.Content
		class="w-full max-w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
		transition={flyAndScale}
	>
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<PencilSimpleLine class="mr-2 text-foreground-alt sq-[22px]" />
				Edit
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd"
				>
					E
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>
				<div class="flex items-center">
					<PlusCircle class="mr-2 text-foreground-alt sq-[22px]" />
					Add
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd"
					>
						⌘
					</kbd>
					<kbd
						class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd"
					>
						N
					</kbd>
				</div>
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent
				class="w-full max-w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
				transition={flyAndScale}
			>
				<ContextMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Header
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Paragraph
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Codeblock
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					List
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Task
				</ContextMenu.Item>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<CopySimple class="mr-2 text-foreground-alt sq-[22px]" />
				Duplicate
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex h-5 w-5 items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd"
				>
					D
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted" />
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<Trash class="mr-2 text-foreground-alt sq-[22px]" />
				Delete
			</div>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
