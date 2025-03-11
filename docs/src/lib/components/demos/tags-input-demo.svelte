<script lang="ts">
	import { TagsInput } from "bits-ui";
	import X from "phosphor-svelte/lib/X";

	let value = $state<string[]>(["hello", "world"]);
</script>

<div class="flex items-center justify-center">
	<TagsInput.Root bind:value class="flex flex-col gap-2" delimiters={[","]}>
		<div
			class="rounded-card-sm border-border-input bg-background placeholder:text-foreground-alt/50 focus-within:ring-foreground focus-within:ring-offset-background hover:border-dark-40 [&:has([data-invalid])]:border-destructive flex h-auto w-[400px] flex-col gap-4 border p-4 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
		>
			<TagsInput.List class="flex min-h-5 flex-wrap gap-1.5">
				{#each value as tag, index}
					<TagsInput.Tag value={tag} {index}>
						<TagsInput.TagContent
							class="flex items-center gap-3 rounded-[4px] bg-[#FCDAFE] text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
						>
							<TagsInput.TagText class="w-full py-1 pl-1.5">
								{tag}
							</TagsInput.TagText>
							<TagsInput.TagRemove
								class="flex items-center justify-center rounded-r-[4px] border-l border-l-pink-300/50 px-1 py-1 hover:bg-[#edc6f0]"
							>
								<X class="size-3" />
							</TagsInput.TagRemove>
						</TagsInput.TagContent>
						<TagsInput.TagEditInput
							class="border-border-input bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-foreground focus:ring-offset-background inline-flex h-5 w-auto items-center rounded-sm border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
						/>
					</TagsInput.Tag>
				{/each}
			</TagsInput.List>
			<TagsInput.Input
				class="focus-override bg-transparent focus:outline-none focus:ring-0 "
				placeholder="Add a tag..."
				aria-label="Add a tag"
				blurBehavior="add"
			/>
		</div>
		<TagsInput.Clear
			class="h-input rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background active:scale-98 inline-flex w-full items-center justify-center text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			Clear Tags
		</TagsInput.Clear>
	</TagsInput.Root>
</div>
