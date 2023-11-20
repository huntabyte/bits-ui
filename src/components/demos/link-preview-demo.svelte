<script lang="ts">
	import { LinkPreview, Avatar } from "$lib";
	import { MapPin, CalendarBlank } from "phosphor-svelte";
</script>

<LinkPreview.Root>
	<LinkPreview.Trigger
		href="https://github.com/sveltejs"
		target="_blank"
		rel="noreferrer noopener"
		class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
	>
		<Avatar.Root
			class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-[17px] font-medium uppercase text-muted-foreground"
		>
			<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
			<Avatar.Fallback>HB</Avatar.Fallback>
		</Avatar.Root>
	</LinkPreview.Trigger>
	<LinkPreview.Content
		class="w-[331px] rounded-xl border border-muted bg-background p-[17px] shadow-popover"
		sideOffset={8}
	>
		<div class="flex space-x-4">
			<Avatar.Root
				class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-[17px] font-medium uppercase text-muted-foreground"
			>
				<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
				<Avatar.Fallback>HB</Avatar.Fallback>
			</Avatar.Root>
			<div class="space-y-1">
				<h4 class="text-sm font-medium">@huntabyte</h4>
				<p class="text-sm">I do things on the internet.</p>
				<div class="flex items-center gap-[21px]">
					<div class="flex items-center pt-2">
						<MapPin class="mr-1 h-4 w-4 opacity-70" />
						<span class="text-xs text-muted-foreground"> FL, USA </span>
					</div>
					<div class="flex items-center pt-2">
						<CalendarBlank class="mr-1 h-4 w-4 opacity-70" />
						<span class="text-xs text-muted-foreground"> Joined May 2020</span>
					</div>
				</div>
			</div>
		</div>
	</LinkPreview.Content>
</LinkPreview.Root>
