<script lang="ts">
	import { Popover, Separator, Toggle } from "bits-ui";
	import ImageSquare from "phosphor-svelte/lib/ImageSquare";
	import LinkSimpleHorizontalBreak from "phosphor-svelte/lib/LinkSimpleHorizontalBreak";

	let width = $state(1024);
	let height = $state(768);
</script>

<Popover.Root>
	<Popover.Trigger
		class="rounded-input bg-dark
	text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
	>
		Resize
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="border-dark-10 bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-popover-content-transform-origin) z-30 w-full max-w-[328px] rounded-[12px] border p-4"
			sideOffset={8}
		>
			<div class="flex items-center">
				<div class="bg-muted mr-3 flex size-12 items-center justify-center rounded-full">
					<ImageSquare class="size-6" />
				</div>
				<div class="flex flex-col">
					<h4 class="text-[17px] font-semibold leading-5 tracking-[-0.01em]">
						Resize image
					</h4>
					<p class="text-muted-foreground text-sm font-medium">
						Resize your photos easily
					</p>
				</div>
			</div>
			<Separator.Root class="bg-dark-10 -mx-4 mb-6 mt-[17px] block h-px" />
			<div class="flex items-center pb-2">
				<div class="mr-2 flex items-center">
					<div class="relative mr-2">
						<span class="sr-only">Width</span>
						<span
							aria-hidden="true"
							class="text-xxs text-muted-foreground absolute left-5 top-4">W</span
						>
						<input
							type="number"
							class="h-input rounded-10px border-border-input bg-background text-foreground w-[119px] border pl-10 pr-2 text-base sm:text-sm"
							bind:value={width}
						/>
					</div>
					<div class="relative">
						<span class="sr-only">Height</span>
						<span
							aria-hidden="true"
							class="text-xxs text-muted-foreground absolute left-5 top-4">H</span
						>
						<input
							type="number"
							class="h-input rounded-10px border-border-input bg-background text-foreground w-[119px] border pl-10 pr-2 text-base sm:text-sm"
							bind:value={height}
						/>
					</div>
				</div>
				<Toggle.Root
					aria-label="toggle constrain portions"
					class="bg-background hover:bg-muted data-[state=on]:bg-muted inline-flex size-10 items-center justify-center rounded-[9px] transition-all active:scale-[0.98]"
				>
					<LinkSimpleHorizontalBreak class="size-6" />
				</Toggle.Root>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
