<script lang="ts">
	import { TagsInput } from "bits-ui";
	import X from "phosphor-svelte/lib/X";
	import DropdownMenuDemo from "$lib/components/demos/dropdown-menu-demo.svelte";

	let value = $state<string[]>(["hello", "world"]);
</script>

<div class="flex items-center justify-center">
	<TagsInput.Root
		bind:value
		class="inline-flex h-input w-full items-center gap-4 rounded-card-sm border border-border-input bg-background px-4 text-sm placeholder:text-foreground-alt/50 hover:border-dark-40 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
	>
		<TagsInput.List class="flex flex-wrap gap-1.5">
			{#each value as tag}
				<TagsInput.Tag
					value={tag}
					class="ml-2 flex items-center gap-1 rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
				>
					<TagsInput.TagContent>
						{tag}
					</TagsInput.TagContent>
					<TagsInput.TagRemove>
						<X class="size-3" />
					</TagsInput.TagRemove>
				</TagsInput.Tag>
			{/each}
		</TagsInput.List>
		<TagsInput.Input class="bg-transparent" placeholder="Add a tag..." />
		<TagsInput.Clear class="ml-auto flex items-center gap-1">
			Clear
			<X class="size-5" />
		</TagsInput.Clear>
	</TagsInput.Root>
</div>
