<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DateField.Label class="block select-none">Check-in date</DateField.Label>
		<DateField.Input
			let:segments
			class="flex h-input w-full max-w-[300px] select-none items-center rounded-input border border-border-input bg-background p-3 text-sm shadow-mini"
		>
			{#each segments as { part, value }}
				<div class="inline-block select-none">
					<DateField.Segment
						{part}
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateField.Segment>
				</div>
			{/each}
		</DateField.Input>
	</div>
</DateField.Root>
