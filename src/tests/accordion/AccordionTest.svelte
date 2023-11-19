<script lang="ts" context="module">
	export type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};
</script>

<script lang="ts">
	import { Accordion } from "$lib";

	export let multiple = false;
	export let disabled: Accordion.Props<false>["disabled"] = false;
	export let items: Item[];
	export let value: string | undefined = undefined;
</script>

<Accordion.Root {multiple} {value} {disabled} data-testid="root">
	{#each items as { value, title, disabled, content, level }}
		<Accordion.Item {value} {disabled} data-testid="{value}-item">
			<Accordion.Header {level} data-testid="{value}-header">
				<Accordion.Trigger {disabled} data-testid="{value}-trigger">
					{title}
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-testid="{value}-content"
				>{content}</Accordion.Content
			>
		</Accordion.Item>
	{/each}
</Accordion.Root>
