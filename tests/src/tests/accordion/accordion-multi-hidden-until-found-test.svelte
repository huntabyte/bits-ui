<script lang="ts">
	import { Accordion } from "bits-ui";

	type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let {
		value = [],
		hiddenUntilFound = true,
		items = [],
		...restProps
	}: {
		hiddenUntilFound?: boolean;
		items: Item[];
		value?: string[];
		onValueChange?: (v: string[]) => void;
	} = $props();
</script>

<main>
	<p data-testid="binding">{JSON.stringify(value)}</p>
	<Accordion.Root data-testid="root" type="multiple" bind:value {...restProps}>
		{#each items as { value: itemValue, title, disabled, content, level } (itemValue)}
			<Accordion.Item value={itemValue} {disabled} data-testid="{itemValue}-item">
				<Accordion.Header {level} data-testid="{itemValue}-header">
					<Accordion.Trigger {disabled} data-testid="{itemValue}-trigger">
						{title}
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content data-testid="{itemValue}-content" {hiddenUntilFound}>
					<div data-testid="{itemValue}-searchable-content">
						{content} This is some searchable content that should be found by the browser's
						search functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						<p data-testid="{itemValue}-nested-content">
							Nested paragraph with more searchable text.
						</p>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
	<button
		data-testid="alt-trigger"
		onclick={() => (value = value.length > 0 ? [] : [items[0]?.value ?? ""])}>Toggle</button
	>
</main>
