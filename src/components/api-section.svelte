<script lang="ts">
	import { page } from "$app/stores";
	import { DataAttrsTable, PropsTable } from "@/components/index.js";
	import { h2 as H2, p as P } from "@/components/markdown/index.js";
	import type { APISchema } from "@/types/index.js";
	import { parseMarkdown } from "@/utils/index.js";

	export let schemas: APISchema[] = [];
</script>

<H2>API Reference</H2>

<div class="flex flex-col gap-12 pt-8">
	{#each schemas as schema}
		<div>
			<div
				class="inline-flex h-[29px] items-center justify-center rounded-button bg-accent px-3 font-mono text-[17px] font-medium leading-tight tracking-tight dark:text-neutral-900"
			>
				<h3>
					<span class="text-muted-foreground dark:text-neutral-900/50"
						>{$page.data.title.replaceAll(" ", "")}.</span
					>{schema.title}
				</h3>
			</div>
			<P class="!mb-5 !mt-2">{@html parseMarkdown(schema.description)}</P>
			<div class="flex flex-col gap-4">
				{#if schema.props}
					<PropsTable props={schema.props} />
				{/if}
				{#if schema.slotProps}
					<PropsTable slot props={schema.slotProps} />
				{/if}
				{#if schema.dataAttributes && schema.dataAttributes.length}
					<DataAttrsTable dataAttrs={schema.dataAttributes} />
				{/if}
			</div>
		</div>
	{/each}
</div>
