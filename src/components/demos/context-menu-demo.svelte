<script lang="ts">
	import { ContextMenu } from "$lib";
	import { flyAndScale } from "@/utils";
	import {
		PencilSimpleLine,
		PlusCircle,
		CopySimple,
		Trash,
		MouseSimple
	} from "phosphor-svelte";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-[188px] w-[279px] select-none items-center justify-center rounded-card border-2 border-dashed border-border-input bg-transparent font-semibold text-muted-foreground"
	>
		<div class="flex flex-col items-center justify-center gap-4 text-center">
			<MouseSimple class="sq-8" />
			Right click me
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content
		class="z-50 w-full max-w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
		transition={flyAndScale}
	>
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<PencilSimpleLine class="mr-2 text-foreground-alt sq-5" />
				Edit
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[13px] text-muted-foreground shadow-kbd sq-5"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[11px] text-muted-foreground shadow-kbd sq-5"
				>
					E
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>
				<div class="flex items-center">
					<PlusCircle class="mr-2 text-foreground-alt sq-5" />
					Add
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[13px] text-muted-foreground shadow-kbd sq-5"
					>
						⌘
					</kbd>
					<kbd
						class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[11px] text-muted-foreground shadow-kbd sq-5"
					>
						N
					</kbd>
				</div>
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent
				class="z-50 w-full max-w-[209px] select-none rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
				transition={flyAndScale}
				sideOffset={10}
			>
				<ContextMenu.Item
					class="flex h-10 items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Header
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Paragraph
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Codeblock
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					List
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-normal outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Task
				</ContextMenu.Item>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<CopySimple class="mr-2 text-foreground-alt sq-5" />
				Duplicate
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[13px] text-muted-foreground shadow-kbd sq-5"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[11px] text-muted-foreground shadow-kbd sq-5"
				>
					D
				</kbd>
			</div>
		</ContextMenu.Item>
		<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />
		<ContextMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<Trash class="mr-2 text-foreground-alt sq-5" />
				Delete
			</div>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
