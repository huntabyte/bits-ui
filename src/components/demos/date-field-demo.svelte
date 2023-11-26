<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DateField.Label class="block select-none">Check-in date</DateField.Label>
		<DateField.Field
			let:segments
			class="flex h-input w-full max-w-[300px] grow-0 select-none items-center rounded-input border border-border-input p-3 shadow-mini"
		>
			{#each segments as { part, value }}
				<div class="inline-block select-none px-0.5">
					<DateField.Segment
						{part}
						class="rounded-[3px] focus-visible:bg-foreground focus-visible:font-medium focus-visible:text-background focus-visible:outline-none data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateField.Segment>
				</div>
			{/each}
		</DateField.Field>
	</div>
	<DateField.Input />
</DateField.Root>
