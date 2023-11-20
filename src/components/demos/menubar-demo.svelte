<script lang="ts">
	import { Menubar } from "$lib";
	import { flyAndScale } from "@/utils";
	import { CaretRight, Cat, Check } from "phosphor-svelte";

	let bookmarks = false;
	let fullUrls = true;

	let pixelGrid = true;
	let layoutGrid = false;

	let view = "table";

	const profileRadioValue = "benoit";
</script>

<Menubar.Root
	class="flex h-12 items-center gap-1 rounded-[10px] border border-muted px-[3px] shadow-mini"
>
	<div class="px-[10px]">
		<Cat class="h-6 w-6" />
	</div>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>View</Menubar.Trigger
		>
		<Menubar.Content
			class="w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
			transition={flyAndScale}
			align="start"
			sideOffset={3}
		>
			<Menubar.CheckboxItem
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				bind:checked={pixelGrid}
			>
				Pixel grid
				<Menubar.CheckboxIndicator class="ml-auto ">
					<Check class="h-5 w-5" />
				</Menubar.CheckboxIndicator>
			</Menubar.CheckboxItem>
			<Menubar.CheckboxItem
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				bind:checked={layoutGrid}
			>
				Layout grid
				<Menubar.CheckboxIndicator class="ml-auto">
					<Check class="h-5 w-5" />
				</Menubar.CheckboxIndicator>
			</Menubar.CheckboxItem>
			<Menubar.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted" />
			<Menubar.RadioGroup bind:value={view}>
				<Menubar.RadioItem
					value="table"
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Table
					<Menubar.RadioIndicator class="ml-auto">
						<Check class="h-5 w-5" />
					</Menubar.RadioIndicator>
				</Menubar.RadioItem>
				<Menubar.RadioItem
					value="board"
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Board
					<Menubar.RadioIndicator class="ml-auto">
						<Check class="h-5 w-5" />
					</Menubar.RadioIndicator>
				</Menubar.RadioItem>
				<Menubar.RadioItem
					value="gallery"
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					Gallery
					<Menubar.RadioIndicator class="ml-auto">
						<Check class="h-5 w-5" />
					</Menubar.RadioIndicator>
				</Menubar.RadioItem>
			</Menubar.RadioGroup>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>Edit</Menubar.Trigger
		>
		<Menubar.Content
			class="w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
			transition={flyAndScale}
			align="start"
			sideOffset={3}
		>
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Undo</Menubar.Item
			>
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Redo</Menubar.Item
			>
			<Menubar.Separator />
			<Menubar.Sub>
				<Menubar.SubTrigger
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted data-[state=open]:bg-muted"
				>
					Find
					<div class="ml-auto flex items-center gap-px">
						<CaretRight class="h-4 w-4 text-foreground-alt" />
					</div>
				</Menubar.SubTrigger>
				<Menubar.SubContent
					class="w-full max-w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
					transition={flyAndScale}
				>
					<Menubar.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
						>Search the web</Menubar.Item
					>
					<Menubar.Separator />
					<Menubar.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
						>Find...</Menubar.Item
					>
					<Menubar.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
						>Find Next</Menubar.Item
					>
					<Menubar.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
						>Find Previous</Menubar.Item
					>
				</Menubar.SubContent>
			</Menubar.Sub>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Cut</Menubar.Item
			>
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Copy</Menubar.Item
			>
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Paste</Menubar.Item
			>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>View</Menubar.Trigger
		>
		<Menubar.Content
			class="w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
			transition={flyAndScale}
			align="start"
			sideOffset={3}
		>
			<Menubar.CheckboxItem
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				bind:checked={bookmarks}>Show Bookmarks Bar</Menubar.CheckboxItem
			>
			<Menubar.CheckboxItem
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				bind:checked={fullUrls}>Show Full URLs</Menubar.CheckboxItem
			>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Reload</Menubar.Item
			>
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Force Reload</Menubar.Item
			>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Toggle Fullscreen</Menubar.Item
			>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Hide Sidebar</Menubar.Item
			>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>Profiles</Menubar.Trigger
		>
		<Menubar.Content
			class="w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
			transition={flyAndScale}
			align="start"
			sideOffset={3}
		>
			<Menubar.RadioGroup value={profileRadioValue}>
				<Menubar.RadioItem
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
					value="andy">Andy</Menubar.RadioItem
				>
				<Menubar.RadioItem
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
					value="benoit">Benoit</Menubar.RadioItem
				>
				<Menubar.RadioItem
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
					value="Luis">Luis</Menubar.RadioItem
				>
			</Menubar.RadioGroup>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Edit...</Menubar.Item
			>
			<Menubar.Separator />
			<Menubar.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>Add Profile...</Menubar.Item
			>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
