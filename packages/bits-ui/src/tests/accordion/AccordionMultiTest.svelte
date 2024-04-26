<script lang="ts">
	import { Accordion } from "$lib/index.js";
	import type { OnChangeFn, PrimitiveDivAttributes } from "$lib/internal/types.js";

	type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	type Props = {
		disabled: boolean;
		items: Item[];
		value: string[];
		onValueChange: OnChangeFn<string[]>;
	} & Omit<PrimitiveDivAttributes, "value">;

	let { disabled = false, items = [], value = [], ...restProps }: Props = $props();
</script>

<Accordion.Root type="multiple" {value} {disabled} {...restProps} data-testid="root">
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
