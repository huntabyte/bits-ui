<script lang="ts" module>
	import type { Time } from "@internationalized/date";
	import {
		TimeField,
		type TimeFieldRootProps,
		type WithoutChildrenOrChild,
		type TimeValue,
	} from "bits-ui";
	export type TimeFieldTestProps<T extends TimeValue = Time> = WithoutChildrenOrChild<
		TimeFieldRootProps<T>
	> & {
		name?: string;
	};
</script>

<script lang="ts">
	let { value, placeholder, name, ...restProps }: TimeFieldTestProps = $props();
</script>

<main>
	<button data-testid="reset" onclick={() => (value = undefined)}>Reset</button>
	<div data-testid="value">{value}</div>
	<TimeField.Root bind:value bind:placeholder {...restProps}>
		<div>
			<TimeField.Label data-testid="label">Label</TimeField.Label>
			<TimeField.Input data-testid="input" {name}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (i)}
						<TimeField.Segment
							{part}
							data-testid={part === "literal" ? undefined : part}
						>
							{value}
						</TimeField.Segment>
					{/each}
				{/snippet}
			</TimeField.Input>
		</div>
	</TimeField.Root>
</main>
