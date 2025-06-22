<script lang="ts">
	import { Avatar, DropdownMenu } from "bits-ui";
	import Cardholder from "phosphor-svelte/lib/Cardholder";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import DotsThree from "phosphor-svelte/lib/DotsThree";
	import GearSix from "phosphor-svelte/lib/GearSix";
	import UserCircle from "phosphor-svelte/lib/UserCircle";
	import UserCirclePlus from "phosphor-svelte/lib/UserCirclePlus";
	import Bell from "phosphor-svelte/lib/Bell";
	import Check from "phosphor-svelte/lib/Check";
	import DotOutline from "phosphor-svelte/lib/DotOutline";

	let notifications = $state<boolean>(false);
	let invited = $state("");
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 select-none items-center justify-center rounded-full border text-sm font-medium active:scale-[0.98]"
	>
		<DotsThree class="text-foreground h-6 w-6" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[229px] rounded-xl border px-1 py-1.5"
			sideOffset={8}
		>
			<DropdownMenu.Item
				class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<UserCircle class="text-foreground-alt mr-2 size-5" />
					Profile
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-xs"
					>
						⌘
					</kbd>
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[10px]"
					>
						P
					</kbd>
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<Cardholder class="text-foreground-alt mr-2 size-5" />
					Billing
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-xs"
					>
						⌘
					</kbd>
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[10px]"
					>
						B
					</kbd>
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				<div class="flex items-center">
					<GearSix class="text-foreground-alt mr-2 size-5" />
					Settings
				</div>
				<div class="ml-auto flex items-center gap-px">
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-xs"
					>
						⌘
					</kbd>
					<kbd
						class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[10px]"
					>
						S
					</kbd>
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.CheckboxItem
				bind:checked={notifications}
				class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				{#snippet children({ checked })}
					<div class="flex items-center pr-4">
						<Bell class="text-foreground-alt mr-2 size-5" />
						Notifications
					</div>
					<div class="ml-auto flex items-center gap-px">
						{#if checked}
							<Check class="size-4" />
						{/if}
					</div>
				{/snippet}
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					<div class="flex items-center">
						<UserCirclePlus class="text-foreground-alt mr-2 size-5" />
						Workspace
					</div>
					<div class="ml-auto flex items-center gap-px">
						<CaretRight class="text-foreground-alt size-5" />
					</div>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal>
					<DropdownMenu.SubContent
						class="border-muted bg-background shadow-popover ring-0! ring-transparent! w-[209px] rounded-xl border px-1 py-1.5 outline-none"
						sideOffset={10}
					>
						<DropdownMenu.RadioGroup bind:value={invited}>
							<DropdownMenu.RadioItem
								value="huntabyte"
								class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
							>
								{#snippet children({ checked })}
									<Avatar.Root
										class="border-foreground/50 relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border"
									>
										<Avatar.Image
											src="https://github.com/huntabyte.png"
											alt="@huntabyte"
											class="aspect-square h-full w-full"
										/>
										<Avatar.Fallback
											class="bg-muted text-xxs flex h-full w-full items-center justify-center rounded-full"
											>HJ</Avatar.Fallback
										>
									</Avatar.Root>
									@huntabyte
									{#if checked}
										<DotOutline class="ml-auto size-4" />
									{/if}
								{/snippet}
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem
								value="pavel"
								class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
							>
								{#snippet children({ checked })}
									<Avatar.Root
										class="border-foreground/50 relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border"
									>
										<Avatar.Image
											src="https://github.com/pavelstianko.png"
											alt="@pavel_stianko"
											class="aspect-square h-full w-full"
										/>
										<Avatar.Fallback
											class="bg-muted flex h-full w-full items-center justify-center rounded-full text-xs"
											>PS</Avatar.Fallback
										>
									</Avatar.Root>
									@pavel_stianko
									{#if checked}
										<DotOutline class="ml-auto size-4" />
									{/if}
								{/snippet}
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem
								value="cokakoala"
								class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
							>
								{#snippet children({ checked })}
									<Avatar.Root
										class="border-foreground/50 relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border"
									>
										<Avatar.Image
											src="https://github.com/adriangonz97.png"
											alt="@cokakoala_"
											class="aspect-square h-full w-full"
										/>
										<Avatar.Fallback
											class="bg-muted flex h-full w-full items-center justify-center rounded-full text-xs"
											>CK</Avatar.Fallback
										>
									</Avatar.Root>
									@cokakoala_
									{#if checked}
										<DotOutline class="ml-auto size-4" />
									{/if}
								{/snippet}
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem
								value="tglide"
								class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
							>
								{#snippet children({ checked })}
									<Avatar.Root
										class="border-foreground/50 relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border"
									>
										<Avatar.Image
											src="https://github.com/tglide.png"
											alt="@tglide"
											class="aspect-square h-full w-full"
										/>
										<Avatar.Fallback
											class="bg-muted flex h-full w-full items-center justify-center rounded-full text-xs"
										>
											TL
										</Avatar.Fallback>
									</Avatar.Root>
									@thomasglopes
									{#if checked}
										<DotOutline class="ml-auto size-4" />
									{/if}
								{/snippet}
							</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
