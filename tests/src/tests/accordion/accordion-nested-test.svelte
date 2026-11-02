<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root type="single" value="outer-1">
	<Accordion.Item value="outer-1">
		<Accordion.Header>
			<Accordion.Trigger data-testid="outer-trigger-1">Outer 1</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>
			<Accordion.Root type="single">
				<Accordion.Item value="inner-1">
					<Accordion.Header>
						<Accordion.Trigger data-testid="inner-trigger-1">Inner 1</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content>Inner content 1</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="inner-2">
					<Accordion.Header>
						<Accordion.Trigger data-testid="inner-trigger-2">Inner 2</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content>Inner content 2</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="outer-2">
		<Accordion.Header>
			<Accordion.Trigger data-testid="outer-trigger-2">Outer 2</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Outer content 2</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
