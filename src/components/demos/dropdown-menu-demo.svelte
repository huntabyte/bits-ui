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
		class="border-input inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background text-sm font-medium text-foreground shadow-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		<DotsThree class="h-6 w-6 text-foreground" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="w-full max-w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
		transition={flyAndScale}
		sideOffset={8}
	>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<UserCircle class="mr-2 h-4 w-4 text-foreground-alt" />
				Profile
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
					P
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<Cardholder class="mr-2 h-4 w-4 text-foreground-alt" />
				Billing
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
					B
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
		>
			<div class="flex items-center">
				<GearSix class="mr-2 h-4 w-4 text-foreground-alt" />
				Settings
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
					S
				</kbd>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted" />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted data-[state=open]:bg-muted"
			>
				<div class="flex items-center">
					<UserCirclePlus class="mr-2 h-4 w-4 text-foreground-alt" />
					Invite users
				</div>
				<div class="ml-auto flex items-center gap-px">
					<CaretRight class="h-4 w-4 text-foreground-alt" />
				</div>
			</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent
				class="w-full max-w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
				transition={flyAndScale}
				sideOffset={10}
			>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
					>
						<Avatar.Image
							src="https://github.com/huntabyte.png"
							alt="@huntabyte"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
							>HJ</Avatar.Fallback
						>
					</Avatar.Root>
					@huntabyte
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
					>
						<Avatar.Image
							src="https://github.com/pavelstianko.png"
							alt="@pavel_stianko"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted"
							>PS</Avatar.Fallback
						>
					</Avatar.Root>
					@pavel_stianko
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
					>
						<Avatar.Image
							src="https://github.com/adriangonz97.png"
							alt="@cokakoala_"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted"
							>CK</Avatar.Fallback
						>
					</Avatar.Root>
					@cokakoala_
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				>
					<Avatar.Root
						class="relative mr-3 flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
					>
						<Avatar.Image
							src="https://github.com/tglide.png"
							alt="@tglide"
							class="aspect-square h-full w-full"
						/>
						<Avatar.Fallback
							class="flex h-full w-full items-center justify-center rounded-full bg-muted"
							>TL</Avatar.Fallback
						>
					</Avatar.Root>
					@thomasglopes
				</DropdownMenu.Item>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
	</DropdownMenu.Content>
</DropdownMenu.Root>
