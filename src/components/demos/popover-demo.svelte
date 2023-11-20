<script lang="ts">
	import { Popover, Label, Switch, Separator, Button } from "$lib";
	import { Cookie } from "phosphor-svelte";

	import { flyAndScale } from "@/utils";

	let necessary = true;
	let marketing = false;
	let shopping = false;
</script>

<Popover.Root>
	<Popover.Trigger
		class="inline-flex h-12 items-center
	justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini ring-dark ring-offset-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		Manage Cookies
	</Popover.Trigger>
	<Popover.Content
		class="z-20 w-full max-w-[392px] rounded-card border border-muted bg-background p-5 shadow-card outline-none"
		transition={flyAndScale}
		sideOffset={8}
	>
		<div class="flex items-center">
			<div
				class="mr-[13px] flex h-12 w-12 items-center justify-center rounded-full bg-muted"
			>
				<Cookie class="h-6 w-6" />
			</div>
			<div class="flex flex-col">
				<h4 class="text-[17px] font-semibold tracking-[-0.01em]">
					Set Cookies
				</h4>
				<p class="text-sm font-medium text-muted-foreground">
					Manage your cookie settings here
				</p>
			</div>
		</div>
		<Separator.Root class="-mx-5 mb-7 mt-[17px] block h-px bg-muted" />
		<div class="flex flex-col gap-7 pb-10 pl-2 pr-[2px]">
			<div class="flex w-full items-center justify-between">
				<div class="flex flex-col gap-0.5">
					<div class="flex items-center gap-1.5">
						<Label.Root for="necessary" class="text-sm font-medium"
							>Strictly necessary</Label.Root
						>
						<div
							class="inline-flex h-5 items-center justify-center rounded-[30px] bg-accent px-2 text-[11px] font-medium text-accent-foreground"
						>
							required
						</div>
					</div>
					<p class="text-[13px] font-medium text-muted-foreground">
						These cookies are essential
					</p>
				</div>
				<Switch.Root
					id="necessary"
					class="peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-mini-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
					bind:checked={necessary}
					disabled
				>
					<Switch.Thumb
						class="pointer-events-none block h-6 w-6 rounded-full bg-background shadow-mini ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
					/>
				</Switch.Root>
			</div>
			<div class="flex w-full items-center justify-between">
				<div class="flex flex-col gap-0.5">
					<Label.Root for="marketing" class="text-sm font-medium"
						>Marketing cookies</Label.Root
					>

					<p class="text-[13px] font-medium text-muted-foreground">
						These cookies are non-essential
					</p>
				</div>
				<Switch.Root
					id="marketing"
					class="peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-mini-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
					bind:checked={marketing}
				>
					<Switch.Thumb
						class="pointer-events-none block h-6 w-6 rounded-full bg-background shadow-mini ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
					/>
				</Switch.Root>
			</div>
			<div class="flex w-full items-center justify-between">
				<div class="flex flex-col gap-0.5">
					<Label.Root for="shopping" class="text-sm font-medium"
						>Shopping cookies</Label.Root
					>

					<p class="text-[13px] font-medium text-muted-foreground">
						These cookies are non-essential
					</p>
				</div>
				<Switch.Root
					id="shopping"
					class="peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-mini-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
					bind:checked={shopping}
				>
					<Switch.Thumb
						class="pointer-events-none block h-6 w-6 rounded-full bg-background shadow-mini ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
					/>
				</Switch.Root>
			</div>
		</div>
		<Button.Root
			class="inline-flex h-input w-full items-center justify-center rounded-input bg-dark text-[15px] font-semibold text-background shadow-mini focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			Save settings
		</Button.Root>
	</Popover.Content>
</Popover.Root>
