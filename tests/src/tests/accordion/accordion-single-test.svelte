<script lang="ts">
	import { Accordion, type AccordionRootSingleProps } from "bits-ui";

	type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let {
		disabled = false,
		items = [],
		value = "",
		...restProps
	}: Omit<AccordionRootSingleProps, "type"> & {
		items: Item[];
	} = $props();
</script>

<Accordion.Root {value} {disabled} data-testid="root" type="single" {...restProps}>
	{#each items as { value, title, disabled, content, level } (value)}
		<Accordion.Item {value} {disabled} data-testid="{value}-item">
			<Accordion.Header {level} data-testid="{value}-header">
				<Accordion.Trigger {disabled} data-testid="{value}-trigger">
					{title}
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-testid="{value}-content">{content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
