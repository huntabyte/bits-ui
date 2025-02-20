<script lang="ts">
	import { Menubar } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Cat from "phosphor-svelte/lib/Cat";
	import Check from "phosphor-svelte/lib/Check";
	import { SwitchOff, SwitchOn } from "$icons/index.js";

	let selectedView = $state("table");
	let selectedProfile = $state("pavel");

	let grids = $state([
		{
			checked: true,
			label: "Pixel",
		},
		{
			checked: false,
			label: "Layout",
		},
	]);

	let showConfigs = $state([
		{
			checked: true,
			label: "Show Bookmarks",
		},
		{
			checked: false,
			label: "Show Full URLs",
		},
	]);

	const profiles = [
		{
			value: "hunter",
			label: "Hunter",
		},
		{
			value: "pavel",
			label: "Pavel",
		},
		{
			value: "adrian",
			label: "Adrian",
		},
	];

	const views = [
		{
			value: "table",
			label: "Table",
		},
		{
			value: "board",
			label: "Board",
		},
		{
			value: "gallery",
			label: "Gallery",
		},
	];
</script>

<Menubar.Root
	class="rounded-10px border-dark-10 bg-background-alt shadow-mini flex h-12 items-center gap-1 border px-[3px]"
>
	<div class="px-2.5">
		<Cat class="size-6" />
	</div>
	<Menubar.Menu>
		<Menubar.Trigger
			id="file"
			class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium ring-0! ring-transparent!"
		>
			File
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background  shadow-popover z-50 w-fit rounded-xl border px-1 py-1.5 focus-visible:outline-hidden"
				align="start"
				sideOffset={3}
			>
				{#each grids as grid}
					<Menubar.CheckboxItem
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						bind:checked={grid.checked}
					>
						{#snippet children({ checked })}
							{grid.label} grid
							<div class="ml-auto flex items-center">
								{#if checked}
									<SwitchOn />
								{:else}
									<SwitchOff />
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator class="bg-muted my-1 -ml-1 -mr-1 block h-px" />
				<Menubar.RadioGroup bind:value={selectedView}>
					{#each views as view}
						<Menubar.RadioItem
							value={view.value}
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-2 py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						>
							{#snippet children({ checked })}
								{view.label}
								<div class="ml-auto size-5">
									{#if checked}
										<Check class="size-5" />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger
			id="edit"
			class="data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium ring-0! ring-transparent!"
		>
			Edit
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover z-50 w-full rounded-xl border px-1 py-1.5 focus-visible:outline-hidden"
				align="start"
				sideOffset={3}
			>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Undo
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 min-w-[130px] select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Redo
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Sub>
					<Menubar.SubTrigger
						class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
					>
						Find
						<div class="ml-auto flex items-center">
							<CaretRight class="text-foreground-alt h-4 w-4" />
						</div>
					</Menubar.SubTrigger>
					<Menubar.SubContent
						class="focus-override border-muted bg-background shadow-popover w-full max-w-[209px] rounded-xl border px-1 py-1.5 focus-visible:outline-hidden"
					>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						>
							Search the web
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						>
							Find...
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						>
							Find Next
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						>
							Find Previous
						</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Cut
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Copy
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Paste
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			id="view"
			class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium ring-0! ring-transparent!"
		>
			View
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5 focus-visible:outline-hidden"
				align="start"
				sideOffset={3}
			>
				{#each showConfigs as config}
					<Menubar.CheckboxItem
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
						bind:checked={config.checked}
					>
						{#snippet children({ checked })}
							{config.label}
							<div class="ml-auto flex items-center">
								{#if checked}
									<SwitchOn />
								{:else}
									<SwitchOff />
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Reload
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Force Reload
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Toggle Fullscreen
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
				>
					Hide Sidebar
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			id="profiles"
			class="data-highlighted:bg-muted data-[state=open]:bg-muted mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium ring-0! ring-transparent!"
		>
			Profiles
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5 focus-visible:outline-hidden"
				align="start"
				sideOffset={3}
			>
				<Menubar.RadioGroup bind:value={selectedProfile}>
					{#each profiles as profile}
						<Menubar.RadioItem
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
							value={profile.value}
						>
							{#snippet children({ checked })}
								{profile.label}
								<div class="ml-auto flex items-center">
									{#if checked}
										<Check class="size-5" />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
					>Edit...</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium ring-0! ring-transparent!"
					>Add Profile...</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>
