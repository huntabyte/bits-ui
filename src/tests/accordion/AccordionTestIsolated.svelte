<script lang="ts">
	import { Accordion } from "$lib";
</script>

<Accordion.Root value="1" data-testid="root">
	<Accordion.Item value="1" data-testid="item">
		<Accordion.Header data-testid="header">
			<Accordion.Trigger data-testid="trigger">open</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content data-testid="content">item 1</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
