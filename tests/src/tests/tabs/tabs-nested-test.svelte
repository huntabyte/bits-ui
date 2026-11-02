<script lang="ts">
	import { Tabs } from "bits-ui";
</script>

<Tabs.Root value="outer-1">
	<Tabs.List>
		<Tabs.Trigger value="outer-1" data-testid="outer-trigger-1">Outer 1</Tabs.Trigger>
		<Tabs.Trigger value="outer-2" data-testid="outer-trigger-2">Outer 2</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="outer-1">
		<Tabs.Root value="inner-1">
			<Tabs.List>
				<Tabs.Trigger value="inner-1" data-testid="inner-trigger-1">Inner 1</Tabs.Trigger>
				<Tabs.Trigger value="inner-2" data-testid="inner-trigger-2">Inner 2</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="inner-1">Inner content 1</Tabs.Content>
			<Tabs.Content value="inner-2">Inner content 2</Tabs.Content>
		</Tabs.Root>
	</Tabs.Content>
	<Tabs.Content value="outer-2">Outer content 2</Tabs.Content>
</Tabs.Root>
