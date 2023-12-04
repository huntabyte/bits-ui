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
			class="flex items-center justify-center rounded-full bg-muted text-[17px] font-medium uppercase text-muted-foreground sq-12"
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
				class="flex items-center justify-center rounded-full bg-muted text-[17px] font-medium uppercase text-muted-foreground sq-12"
			>
				<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
				<Avatar.Fallback>HB</Avatar.Fallback>
			</Avatar.Root>
			<div class="space-y-1 text-sm">
				<h4 class="font-medium">@huntabyte</h4>
				<p>I do things on the internet.</p>
				<div
					class="flex items-center gap-[21px] pt-2 text-xs text-muted-foreground"
				>
					<div class="flex items-center text-xs">
						<MapPin class="mr-1 sq-4" />
						<span> FL, USA </span>
					</div>
					<div class="flex items-center text-xs">
						<CalendarBlank class="mr-1 sq-4" />
						<span> Joined May 2020</span>
					</div>
				</div>
			</div>
		</div>
	</LinkPreview.Content>
</LinkPreview.Root>
