<script lang="ts">
	import { TagsInput } from "bits-ui";
	import X from "phosphor-svelte/lib/X";
	import Pencil from "phosphor-svelte/lib/Pencil";

	let value = $state<string[]>(["hello", "world"]);
</script>

<div class="flex items-center justify-center">
	<TagsInput.Root bind:value class="flex flex-col gap-2" delimiters={[","]}>
		<div
			class="flex h-auto w-[400px] flex-col gap-4 rounded-card-sm border border-border-input bg-background p-4 text-sm placeholder:text-foreground-alt/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-dark-40 [&:has([data-invalid])]:border-destructive"
		>
			<TagsInput.List class="flex min-h-5 flex-wrap gap-1.5">
				{#each value as tag, index}
					<TagsInput.Tag value={tag} {index} editMode="contenteditable">
						<TagsInput.TagContent
							class="flex items-center gap-3 divide-x divide-pink-300/50 rounded-[4px] bg-[#FCDAFE] text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
						>
							<TagsInput.TagText class="py-1 pl-1.5">
								{tag}
							</TagsInput.TagText>
							<div class="flex items-center divide-x divide-pink-300/50">
								<TagsInput.TagEdit
									class="flex items-center justify-center px-1 py-1 hover:bg-[#edc6f0]"
								>
									<Pencil class="size-3" />
								</TagsInput.TagEdit>
								<TagsInput.TagRemove
									class="flex items-center justify-center rounded-r-[4px] px-1 py-1 hover:bg-[#edc6f0]"
								>
									<X class="size-3" />
								</TagsInput.TagRemove>
							</div>
						</TagsInput.TagContent>
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
			class="inline-flex h-input w-full items-center justify-center rounded-input bg-muted text-[15px] font-medium shadow-mini transition-all hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			Clear Tags
		</TagsInput.Clear>
	</TagsInput.Root>
</div>
