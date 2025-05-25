<script lang="ts" module>
	import type { Time } from "@internationalized/date";
	import {
		TimeRangeField,
		type TimeValue,
		type TimeRangeFieldInputProps,
		type TimeRangeFieldRootProps,
		type WithoutChildrenOrChild,
	} from "bits-ui";

	export type TimeRangeFieldTestProps<T extends TimeValue = Time> = WithoutChildrenOrChild<
		TimeRangeFieldRootProps<T>
	> & {
		startProps?: Omit<TimeRangeFieldInputProps, "type">;
		endProps?: Omit<TimeRangeFieldInputProps, "type">;
	};

	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	let { value, placeholder, startProps, endProps, ...restProps }: TimeRangeFieldTestProps<T> =
		$props();
</script>

<main>
	<div data-testid="value">{value}</div>
	<div data-testid="start-value">{value?.start?.toString()}</div>
	<div data-testid="end-value">{value?.end?.toString()}</div>
	<TimeRangeField.Root bind:value bind:placeholder {...restProps} data-testid="root">
		<TimeRangeField.Label data-testid="label">Label</TimeRangeField.Label>
		{#each ["start", "end"] as const as type (type)}
			{@const inputProps = type === "start" ? startProps : endProps}
			<TimeRangeField.Input data-testid="{type}-input" {type} {...inputProps}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (i)}
						<TimeRangeField.Segment
							{part}
							data-testid={part === "literal" ? undefined : `${type}-${part}`}
						>
							{value}
						</TimeRangeField.Segment>
					{/each}
				{/snippet}
			</TimeRangeField.Input>
		{/each}
	</TimeRangeField.Root>
</main>
