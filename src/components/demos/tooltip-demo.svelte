<script lang="ts">
	import * as Button from "@/components/ui/button";
	import * as Tooltip from "@/components/ui/tooltip";
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button.Root builders={[builder]} variant="outline">Hover</Button.Root>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Add to library</p>
	</Tooltip.Content>
</Tooltip.Root>
