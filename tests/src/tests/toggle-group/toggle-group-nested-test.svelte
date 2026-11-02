<script lang="ts">
	import { ToggleGroup } from "bits-ui";
</script>

<ToggleGroup.Root type="single">
	<ToggleGroup.Item value="outer-1" data-testid="outer-item-1">Outer 1</ToggleGroup.Item>
	<ToggleGroup.Root type="single">
		<ToggleGroup.Item value="inner-1" data-testid="inner-item-1">Inner 1</ToggleGroup.Item>
		<ToggleGroup.Item value="inner-2" data-testid="inner-item-2">Inner 2</ToggleGroup.Item>
	</ToggleGroup.Root>
	<ToggleGroup.Item value="outer-2" data-testid="outer-item-2">Outer 2</ToggleGroup.Item>
</ToggleGroup.Root>
