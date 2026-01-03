<script lang="ts">
	import { Button, Popover, Separator } from "bits-ui";
	import MapPin from "phosphor-svelte/lib/MapPin";
	import Calendar from "phosphor-svelte/lib/Calendar";
</script>

<Popover.Root>
	<Popover.Trigger
		openOnHover
		openDelay={200}
		closeDelay={100}
		class="bg-muted hover:bg-muted/80 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium transition-colors"
	>
		<img
			src="https://github.com/huntabyte.png"
			alt=""
			class="size-6 rounded-full object-cover"
		/>
		huntabyte
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="border-dark-10 bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-popover-content-transform-origin) z-30 w-full max-w-[300px] rounded-[12px] border p-4 focus-visible:outline-none"
			sideOffset={8}
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-start gap-3">
					<div
						class="bg-muted flex size-12 shrink-0 items-center justify-center rounded-full"
					>
						<img
							src="https://github.com/huntabyte.png"
							alt="Hunter Johnston"
							class="size-full rounded-full object-cover"
						/>
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-[15px] font-semibold leading-5">Hunter Johnston</span>
						<span class="text-muted-foreground text-sm">@huntabyte</span>
					</div>
				</div>
				<Button.Root
					href="https://x.com/huntabyte"
					target="_blank"
					class="bg-dark text-background shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
				>
					Follow
				</Button.Root>
			</div>
			<p class="text-foreground/90 mt-3 text-sm leading-relaxed">
				Building Bits UI and other open source tools for the Svelte ecosystem.
			</p>
			<Separator.Root class="bg-dark-10 -mx-4 my-3 block h-px" />
			<div class="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
				<span class="inline-flex items-center gap-1">
					<MapPin class="size-3.5" />
					FL, USA
				</span>
				<span class="inline-flex items-center gap-1">
					<Calendar class="size-3.5" />
					Joined 2020
				</span>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
