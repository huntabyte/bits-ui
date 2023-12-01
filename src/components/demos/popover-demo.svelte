<script lang="ts">
	import { Popover, Separator, Toggle } from "$lib";
	import { ImageSquare, LinkSimpleHorizontalBreak } from "phosphor-svelte";
	import { flyAndScale } from "@/utils";

	let width = 1024;
	let height = 768;
</script>

<Popover.Root>
	<Popover.Trigger
		class="inline-flex h-10
	items-center justify-center whitespace-nowrap rounded-input bg-dark px-[21px] text-[15px] font-medium text-background shadow-mini transition-all hover:cursor-pointer hover:bg-dark/95 active:scale-98"
	>
		Resize
	</Popover.Trigger>
	<Popover.Content
		class="z-30 w-full max-w-[328px] rounded-[12px] border border-dark-10 bg-background p-4 shadow-popover"
		transition={flyAndScale}
		sideOffset={8}
	>
		<div class="flex items-center">
			<div
				class="mr-3 flex items-center justify-center rounded-full bg-muted sq-12"
			>
				<ImageSquare class="sq-6" />
			</div>
			<div class="flex flex-col">
				<h4 class="text-[17px] font-semibold leading-5 tracking-[-0.01em]">
					Resize image
				</h4>
				<p class="text-sm font-medium text-muted-foreground">
					Resize your photos easily
				</p>
			</div>
		</div>
		<Separator.Root class="-mx-4 mb-6 mt-[17px] block h-px bg-dark-10" />
		<div class="flex items-center pb-2">
			<div class="mr-2 flex items-center">
				<div class="relative mr-2">
					<span class="sr-only">Width</span>
					<span
						aria-hidden
						class="absolute left-5 top-4 text-xxs text-muted-foreground">W</span
					>
					<input
						type="number"
						class="h-input w-[119px] rounded-10px border border-border-input bg-background pl-10 pr-2 text-sm text-foreground"
						bind:value={width}
					/>
				</div>
				<div class="relative">
					<span class="sr-only">Height</span>
					<span
						aria-hidden
						class="absolute left-5 top-4 text-xxs text-muted-foreground">H</span
					>
					<input
						type="number"
						class="h-input w-[119px] rounded-10px border border-border-input bg-background pl-10 pr-2 text-sm text-foreground"
						bind:value={height}
					/>
				</div>
			</div>
			<Toggle.Root
				aria-label="toggle constrain portions"
				class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 data-[state=on]:bg-muted"
			>
				<LinkSimpleHorizontalBreak class="sq-6" />
			</Toggle.Root>
		</div>
	</Popover.Content>
</Popover.Root>
