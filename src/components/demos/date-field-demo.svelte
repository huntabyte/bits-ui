<script lang="ts">
	import { DateField } from "$lib";
</script>

<div class="relative w-full max-w-[50%]">
	<div class="h-full w-full">
		<DateField.Root>
			<DateField.Label class="select-none">Check-in date</DateField.Label>
			<DateField.Field
				let:segments
				class="flex h-input w-full max-w-[300px] items-center rounded-input border border-border-input p-3 shadow-mini"
			>
				{#each segments as { part, value }}
					<DateField.Segment
						{part}
						class="grow-0 rounded-5px p-0.5 focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateField.Segment>
				{/each}
			</DateField.Field>
			<DateField.Input />
		</DateField.Root>
	</div>
</div>
