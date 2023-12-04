<script lang="ts">
	import { DateField } from "$lib";

	type $$Props = DateField.Props;
	export let placeholder: DateField.Props["placeholder"] = undefined;
	export let value: DateField.Props["value"] = undefined;
</script>

<main>
	<div data-testid="value">{value}</div>
	<DateField.Root bind:value bind:placeholder {...$$restProps}>
		<div>
			<DateField.Label data-testid="label">Label</DateField.Label>
			<DateField.Input let:segments data-testid="input">
				{#each segments as { part, value }}
					<DateField.Segment
						{part}
						data-testid={part === "literal" ? undefined : part}
					>
						{value}
					</DateField.Segment>
				{/each}
			</DateField.Input>
		</div>
	</DateField.Root>
</main>
