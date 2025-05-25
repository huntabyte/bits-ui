<script lang="ts">
	import { Menubar } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Cat from "phosphor-svelte/lib/Cat";
	import Check from "phosphor-svelte/lib/Check";

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
			class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
		>
			File
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background  shadow-popover focus-visible:outline-hidden z-50 w-fit rounded-xl border px-1 py-1.5"
				align="start"
				sideOffset={3}
			>
				{#each grids as grid (grid.label)}
					<Menubar.CheckboxItem
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						bind:checked={grid.checked}
					>
						{#snippet children({ checked })}
							{grid.label} grid
							<div class="ml-auto flex items-center">
								{#if checked}
									{@render SwitchOn()}
								{:else}
									{@render SwitchOff()}
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator class="bg-muted my-1 -ml-1 -mr-1 block h-px" />
				<Menubar.RadioGroup bind:value={selectedView}>
					{#each views as view, i (view.label + i)}
						<Menubar.RadioItem
							value={view.value}
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-2 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
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
			class="data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
		>
			Edit
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full rounded-xl border px-1 py-1.5"
				align="start"
				sideOffset={3}
			>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Undo
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 min-w-[130px] select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Redo
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Sub>
					<Menubar.SubTrigger
						class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
					>
						Find
						<div class="ml-auto flex items-center">
							<CaretRight class="text-foreground-alt h-4 w-4" />
						</div>
					</Menubar.SubTrigger>
					<Menubar.SubContent
						class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden w-full max-w-[209px] rounded-xl border px-1 py-1.5"
					>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Search the web
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Find...
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Find Next
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Find Previous
						</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Cut
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Copy
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Paste
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
		>
			View
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5"
				align="start"
				sideOffset={3}
			>
				{#each showConfigs as config, i (config.label + i)}
					<Menubar.CheckboxItem
						class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						bind:checked={config.checked}
					>
						{#snippet children({ checked })}
							{config.label}
							<div class="ml-auto flex items-center">
								{#if checked}
									{@render SwitchOn()}
								{:else}
									{@render SwitchOff()}
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Reload
				</Menubar.Item>
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Force Reload
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Toggle Fullscreen
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					Hide Sidebar
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="data-highlighted:bg-muted data-[state=open]:bg-muted mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
		>
			Profiles
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5"
				align="start"
				sideOffset={3}
			>
				<Menubar.RadioGroup bind:value={selectedProfile}>
					{#each profiles as profile, i (profile.label + i)}
						<Menubar.RadioItem
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
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
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
					>Edit...</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Item
					class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
					>Add Profile...</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>

{#snippet SwitchOn()}
	<div
		class="bg-dark-10 peer inline-flex h-[15.6px] min-h-[15.6px] w-[26px] shrink-0 items-center rounded-full px-[1.5px]"
	>
		<span
			class="bg-background dark:border-border-input dark:shadow-mini pointer-events-none block size-[13px] shrink-0 translate-x-[10px] rounded-full"
		></span>
	</div>
{/snippet}

{#snippet SwitchOff()}
	<div
		class="bg-dark-10 shadow-mini-inset peer inline-flex h-[15.6px] w-[26px] shrink-0 items-center rounded-full px-[3px] transition-colors"
	>
		<span
			class="bg-background shadow-mini dark:border-border-input dark:shadow-mini pointer-events-none block size-[13px] shrink-0 translate-x-0 rounded-full transition-transform dark:border"
		></span>
	</div>
{/snippet}
