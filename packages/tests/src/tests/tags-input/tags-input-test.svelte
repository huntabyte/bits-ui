<script lang="ts" module>
	import { TagsInput, type WithoutChildrenOrChild } from "bits-ui";
	export type TagsInputTestProps = WithoutChildrenOrChild<TagsInput.RootProps> & {
		editable?: boolean;
		removable?: boolean;
	};
</script>

<script lang="ts">
	let {
		editable = true,
		removable = true,
		value = $bindable([]),
		...restProps
	}: TagsInputTestProps = $props();
</script>

<TagsInput.Root bind:value {...restProps} data-testid="root">
	<TagsInput.List class="flex min-h-5 flex-wrap gap-1.5" data-testid="list">
		{#each value as tag, index}
			<TagsInput.Tag value={tag} {index} {editable} {removable} data-testid="tag-{tag}">
				<TagsInput.TagContent
					data-testid="tag-content-{tag}"
					class="flex items-center gap-1 rounded-[4px] bg-[#FCDAFE] text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
				>
					<TagsInput.TagText data-testid="tag-text-{tag}" class="py-1 pl-1.5">
						{tag}
					</TagsInput.TagText>
					<TagsInput.TagRemove
						data-testid="tag-remove-{tag}"
						class="flex items-center justify-center rounded-r-[4px] px-1 py-1 hover:bg-[#edc6f0]"
					>
						close
					</TagsInput.TagRemove>
				</TagsInput.TagContent>
				<TagsInput.TagEdit data-testid="tag-edit-{tag}" />
			</TagsInput.Tag>
		{/each}
	</TagsInput.List>
	<TagsInput.Input
		data-testid="input"
		class="focus-override bg-transparent focus:outline-none focus:ring-0 "
		placeholder="Add a tag..."
		blurBehavior="add"
	/>
	<TagsInput.Clear
		data-testid="clear"
		class="inline-flex h-input w-full items-center justify-center rounded-input bg-muted text-[15px] font-medium shadow-mini transition-all hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		Clear Tags
	</TagsInput.Clear>
</TagsInput.Root>
