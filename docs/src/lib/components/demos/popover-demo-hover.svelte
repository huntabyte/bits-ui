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
		class="inline-flex items-center gap-2 rounded-full bg-muted py-1.5 pr-3 pl-1.5 text-sm font-medium transition-colors hover:bg-muted/80"
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
			class="z-50 w-full max-w-[300px] origin-(--bits-popover-content-transform-origin) rounded-[12px] border border-dark-10 bg-background p-4 shadow-popover focus-visible:outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={8}
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-start gap-3">
					<div
						class="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted"
					>
						<img
							src="https://github.com/huntabyte.png"
							alt="Hunter Johnston"
							class="size-full rounded-full object-cover"
						/>
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-[15px] leading-5 font-semibold">Hunter Johnston</span>
						<span class="text-sm text-muted-foreground">@huntabyte</span>
					</div>
				</div>
				<Button.Root
					href="https://x.com/huntabyte"
					target="_blank"
					class="shrink-0 rounded-full bg-dark px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
				>
					Follow
				</Button.Root>
			</div>
			<p class="mt-3 text-sm leading-relaxed text-foreground/90">
				Building Bits UI and other open source tools for the Svelte ecosystem.
			</p>
			<Separator.Root class="-mx-4 my-3 block h-px bg-dark-10" />
			<div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
