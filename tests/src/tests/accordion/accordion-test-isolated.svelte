<script lang="ts" module>
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";

	export type AccordionTestIsolatedProps = {
		triggerProps?: WithoutChildrenOrChild<Accordion.TriggerProps>;
	};
</script>

<script lang="ts">
	let { triggerProps }: AccordionTestIsolatedProps = $props();
</script>

<Accordion.Root type="single" value="1" data-testid="root">
	<Accordion.Item value="1" data-testid="item">
		<Accordion.Header data-testid="header">
			<Accordion.Trigger data-testid="trigger" {...triggerProps}>open</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content data-testid="content">item 1</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
