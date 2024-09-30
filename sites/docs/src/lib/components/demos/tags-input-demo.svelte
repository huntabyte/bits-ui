<script lang="ts">
	import { TagsInput } from "bits-ui";
	import X from "phosphor-svelte/lib/X";

	let value = $state<string[]>(["hello", "world"]);
</script>

<div class="flex items-center justify-center">
	<TagsInput.Root bind:value class="flex flex-col gap-2">
		<div
			class="flex h-auto w-[400px] flex-col gap-4 rounded-card-sm border border-border-input bg-background p-4 text-sm placeholder:text-foreground-alt/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-dark-40"
		>
			<TagsInput.List class="flex flex-wrap gap-1.5">
				{#each value as tag}
					<TagsInput.Tag
						value={tag}
						class="flex items-center gap-1 rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
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
			<TagsInput.Input
				class="focus-override bg-transparent focus:outline-none focus:ring-0 "
				placeholder="Add a tag..."
			/>
		</div>
		<TagsInput.Clear
			class="inline-flex h-9 items-center
	justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini transition-colors hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			Clear
			<X class="ml-1.5 size-4" />
		</TagsInput.Clear>
	</TagsInput.Root>
</div>
