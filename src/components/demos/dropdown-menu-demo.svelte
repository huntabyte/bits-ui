<script lang="ts">
	import { DropdownMenu } from "$lib";
	import { Avatar } from "$lib";
	import { flyAndScale } from "@/utils";
	import {
		UserCircle,
		Cardholder,
		GearSix,
		UserCirclePlus,
		DotsThree,
		CaretRight
	} from "phosphor-svelte";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="focus-visible inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-input bg-background text-sm font-medium text-foreground shadow-btn hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		<DotsThree class="h-6 w-6 text-foreground" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="w-full max-w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover"
		transition={flyAndScale}
		sideOffset={8}
	>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<UserCircle class="mr-2 text-foreground-alt sq-5" />
				Profile
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd sq-5"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd sq-5"
				>
					P
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<Cardholder class="mr-2 text-foreground-alt sq-5" />
				Billing
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd sq-5"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd sq-5"
				>
					B
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<GearSix class="mr-2 text-foreground-alt sq-5" />
				Settings
			</div>
			<div class="ml-auto flex items-center gap-px">
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd sq-5"
				>
					⌘
				</kbd>
				<kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd sq-5"
				>
					S
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted" />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>
				<div class="flex items-center">
					<UserCirclePlus class="mr-2 text-foreground-alt sq-5" />
					Invite users
				</div>
				<div class="ml-auto flex items-center gap-px">
					<CaretRight class="text-foreground-alt sq-5" />
				</div>
			</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent
				class="w-full max-w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover !ring-0 !ring-transparent"
				transition={flyAndScale}
				sideOffset={10}
			>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex shrink-0 overflow-hidden rounded-full border border-foreground/50 sq-5"
					>
						<Avatar.Image
							src="https://github.com/huntabyte.png"
							alt="@huntabyte"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xxs"
							>HJ</Avatar.Fallback
						>
					</Avatar.Root>
					@huntabyte
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex shrink-0 overflow-hidden rounded-full border border-foreground/50 sq-5"
					>
						<Avatar.Image
							src="https://github.com/pavelstianko.png"
							alt="@pavel_stianko"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
							>PS</Avatar.Fallback
						>
					</Avatar.Root>
					@pavel_stianko
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex shrink-0 overflow-hidden rounded-full border border-foreground/50 sq-5"
					>
						<Avatar.Image
							src="https://github.com/adriangonz97.png"
							alt="@cokakoala_"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
							>CK</Avatar.Fallback
						>
					</Avatar.Root>
					@cokakoala_
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex shrink-0 overflow-hidden rounded-full border border-foreground/50 sq-5"
					>
						<Avatar.Image
							src="https://github.com/tglide.png"
							alt="@tglide"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
							>TL</Avatar.Fallback
						>
					</Avatar.Root>
					@thomasglopes
				</DropdownMenu.Item>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
	</DropdownMenu.Content>
</DropdownMenu.Root>
