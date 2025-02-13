<script lang="ts">
	import { Avatar, DropdownMenu, Tabs } from "bits-ui";
	import Cardholder from "phosphor-svelte/lib/Cardholder";
	import DotsThreeVertical from "phosphor-svelte/lib/DotsThreeVertical";
	import UserCircle from "phosphor-svelte/lib/UserCircle";

	let loadingStatus = $state<Avatar.RootProps["loadingStatus"]>("loading");
</script>

<div
	class="relative order-3 flex h-min translate-y-14 border border-solid border-[#cccccc] lg:order-4 lg:translate-y-[40%]"
>
	<div
		class="circle absolute left-0 top-0 aspect-square w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>
	<div
		class="circle absolute right-0 top-0 aspect-square w-3 -translate-y-1/2 translate-x-1/2 rounded-full border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>
	<div
		class="middle absolute left-1/2 top-0 aspect-[24/6] w-6 -translate-x-1/2 -translate-y-1/2 rounded-[7px] border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>
	<div
		class="middle absolute bottom-0 left-1/2 aspect-[24/6] w-6 -translate-x-1/2 translate-y-1/2 rounded-[7px] border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>
	<div
		class="circle absolute bottom-0 left-0 aspect-square w-3 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>
	<div
		class="circle absolute bottom-0 right-0 aspect-square w-3 translate-x-1/2 translate-y-1/2 rounded-full border border-[#A3A3A4] bg-white dark:border-white dark:bg-[#131313]"
	></div>

	<div
		class="m-1.5 aspect-square w-full rounded-card-lg bg-[#FEFCE8] px-3 py-3 dark:bg-[#FFFBD4] lg:m-[10px] lg:px-[14px]"
	>
		<Tabs.Root value="follow">
			<Tabs.List
				class="mb-[10px] flex h-7 items-center rounded-input bg-[#18181B12] px-[3px] py-1 shadow-mini-inset dark:shadow-[0px_1px_0px_0px_rgba(0,_0,_0,_0.04)_inset] lg:mb-[14px] lg:h-10"
			>
				<Tabs.Trigger
					value="follow"
					class="h-[23px] w-full rounded-[7px] text-xxs font-medium text-foreground/70 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-mini dark:text-[#171717]/70 dark:data-[state=active]:text-[#171717] dark:data-[state=active]:shadow-[0px_1px_0px_1px_rgba(0,_0,_0,_0.04);] lg:h-8 lg:text-sm"
					>Follow</Tabs.Trigger
				>
				<Tabs.Trigger
					value="other"
					class="h-[23px] w-full rounded-[7px] text-xxs font-medium text-foreground/70 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-mini dark:text-[#171717]/70 dark:data-[state=active]:text-[#171717] dark:data-[state=active]:shadow-[0px_1px_0px_1px_rgba(0,_0,_0,_0.04);] lg:h-8 lg:text-sm"
					>Other</Tabs.Trigger
				>
			</Tabs.List>

			<Tabs.Content value="follow" class="select-none ">
				{@render UserListItem({
					alt: "@huntabyte",
					src: "/avatar-1.png",
					fallback: "HB",
					firstName: "Huntabyte",
					username: "huntabyte",
				})}
				{@render UserListItem({
					alt: "@pavelstianko",
					src: "/avatar-1.png",
					fallback: "PS",
					firstName: "Pavel",
					username: "pavelstianko",
				})}
			</Tabs.Content>
			<Tabs.Content value="other" class="select-none">
				{@render UserListItem({
					alt: "@pája",
					src: "/avatar-1.png",
					fallback: "PJ",
					firstName: "Pája",
					username: "paja",
				})}
				{@render UserListItem({
					alt: "@CokaKoala",
					src: "/avatar-1.png",
					fallback: "PS",
					firstName: "Adrian",
					username: "AdrianGonz97",
				})}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

{#snippet UserListItem({
	src,
	alt,
	fallback,
	firstName,
	username,
}: {
	src: string;
	alt: string;
	fallback: string;
	firstName: string;
	username: string;
})}
	<div class="mb-3 flex items-center justify-between">
		<div class="flex">
			<Avatar.Root
				bind:loadingStatus
				class="h-7 w-7 rounded-full border lg:h-10 lg:w-10 {loadingStatus === 'loaded'
					? 'border-foreground'
					: 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground dark:border-[#807F82]"
			>
				<div
					class="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
				>
					<Avatar.Image {src} {alt} />
					<Avatar.Fallback class="border border-muted">{fallback}</Avatar.Fallback>
				</div>
			</Avatar.Root>
			<div class="name ml-1.5 lg:ml-2">
				<h3 class="text-xxs font-medium text-foreground dark:text-[#171717] lg:text-sm">
					{firstName}
				</h3>
				<p
					class="text-[9px] font-medium text-muted-foreground dark:text-[#171717]/50 lg:text-[12px]"
				>
					@{username}
				</p>
			</div>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="focus-visible text-a-foreground inline-flex size-6 select-none items-center justify-center rounded-[7px] border border-border-input bg-white text-sm font-medium shadow-mini hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98 dark:border-[#D8D8D8] dark:shadow-[0px_0.8px_0px_0.8px_rgba(0,_0,_0,_0.04)] dark:hover:bg-white lg:size-8"
			>
				<DotsThreeVertical class="size-4 text-foreground dark:text-[#171717] lg:size-5" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
					sideOffset={8}
				>
					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>
						<div class="flex items-center">
							<UserCircle class="mr-2 size-5 text-foreground-alt" />
							Profile
						</div>
						<div class="ml-auto flex items-center gap-px">
							<kbd
								class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
							>
								⌘
							</kbd>
							<kbd
								class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
							>
								P
							</kbd>
						</div>
					</DropdownMenu.Item>

					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>
						<div class="flex items-center">
							<Cardholder class="mr-2 size-5 text-foreground-alt" />
							Billing
						</div>
						<div class="ml-auto flex items-center gap-px">
							<kbd
								class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
							>
								⌘
							</kbd>
							<kbd
								class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
							>
								B
							</kbd>
						</div>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>
{/snippet}
