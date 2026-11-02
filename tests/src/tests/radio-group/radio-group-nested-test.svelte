<script lang="ts">
	import { RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root>
	<RadioGroup.Item value="outer-1" data-testid="outer-item-1">Outer 1</RadioGroup.Item>
	<RadioGroup.Root>
		<RadioGroup.Item value="inner-1" data-testid="inner-item-1">Inner 1</RadioGroup.Item>
		<RadioGroup.Item value="inner-2" data-testid="inner-item-2">Inner 2</RadioGroup.Item>
	</RadioGroup.Root>
	<RadioGroup.Item value="outer-2" data-testid="outer-item-2">Outer 2</RadioGroup.Item>
</RadioGroup.Root>
