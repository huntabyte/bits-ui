<script lang="ts">
	import { ContextMenu } from "bits-ui";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import MouseSimple from "phosphor-svelte/lib/MouseSimple";
	import PencilSimpleLine from "phosphor-svelte/lib/PencilSimpleLine";
	import PlusCircle from "phosphor-svelte/lib/PlusCircle";
	import Trash from "phosphor-svelte/lib/Trash";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="rounded-card border-border-input text-muted-foreground flex h-[188px] w-[279px] select-none items-center justify-center border-2 border-dashed bg-transparent font-semibold"
	>
		<div class="flex flex-col items-center justify-center gap-4 text-center">
			<MouseSimple class="size-8" />
			Right click me
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content
			class="border-muted bg-background shadow-popover w-[229px] rounded-xl border px-1 py-1.5 outline-none focus-visible:outline-none"
		>
			<ContextMenu.Item
				class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<PencilSimpleLine class="text-foreground-alt mr-2 size-5" />
					Edit
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
					>
						⌘
					</kbd>
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
					>
						E
					</kbd>
				</div>
			</ContextMenu.Item>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger
					class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					<div class="flex items-center">
						<PlusCircle class="text-foreground-alt mr-2 size-5" />
						Add
					</div>
					<div class="ml-auto flex items-center gap-px">
						<kbd
							class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
						>
							⌘
						</kbd>
						<kbd
							class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
						>
							N
						</kbd>
					</div>
				</ContextMenu.SubTrigger>
				<ContextMenu.SubContent
					class="border-muted bg-background shadow-popover z-100 ring-0! ring-transparent! w-[209px] rounded-xl border px-1 py-1.5"
					sideOffset={10}
				>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
					>
						Header
					</ContextMenu.Item>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
					>
						Paragraph
					</ContextMenu.Item>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
					>
						Codeblock
					</ContextMenu.Item>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
					>
						List
					</ContextMenu.Item>
					<ContextMenu.Item
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
					>
						Task
					</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
			<ContextMenu.Item
				class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<CopySimple class="text-foreground-alt mr-2 size-5" />
					Duplicate
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
					>
						⌘
					</kbd>
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
					>
						D
					</kbd>
				</div>
			</ContextMenu.Item>
			<ContextMenu.Separator class="bg-muted -mx-1 my-1 block h-px" />
			<ContextMenu.Item
				class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<Trash class="text-foreground-alt mr-2 size-5" />
					Delete
				</div>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
