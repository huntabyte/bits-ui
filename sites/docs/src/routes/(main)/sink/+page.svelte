<script lang="ts">
	import { LinkPreview } from "bits-ui";

	let numbers = [1, 2, 3, 4, 5];
</script>

<div class="flex w-full flex-col">
	{#each numbers as number}
		<LinkPreview.Root>
			<LinkPreview.Trigger
				href="https://github.com/sveltejs"
				target="_blank"
				rel="noreferrer noopener"
				class="w-full border border-border p-2"
			>
				{number}
			</LinkPreview.Trigger>
			<LinkPreview.Content
				class="w-[331px] rounded-xl border border-muted bg-background p-[17px] shadow-popover"
				sideOffset={8}
			>
				PREVIEW_CONTENT {number}
			</LinkPreview.Content>
		</LinkPreview.Root>
	{/each}
</div>
