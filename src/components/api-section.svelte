<script lang="ts">
	import { page } from "$app/stores";
	import { DataAttrsTable, PropsTable } from "@/components";
	import { h2 as H2, p as P } from "@/components/markdown";
	import type { APISchema } from "@/types";

	export let schemas: APISchema[] = [];
</script>

<H2>Component API</H2>

<div class="flex flex-col gap-12 pt-8">
	{#each schemas as schema}
		<div>
			<div
				class="inline-flex h-[29px] items-center justify-center rounded-button bg-accent px-3 font-mono text-[17px] font-medium leading-tight tracking-tight"
			>
				<h3>
					<span class="text-muted-foreground"
						>{$page.data.title.replace(" ", "")}.</span
					>{schema.title}
				</h3>
			</div>
			<P class="!mb-5 !mt-2">{schema.description}</P>
			<div class="flex flex-col gap-4">
				{#if schema.props}
					<PropsTable props={schema.props} />
				{/if}
				{#if schema.dataAttributes && schema.dataAttributes.length}
					<DataAttrsTable dataAttrs={schema.dataAttributes} />
				{/if}
			</div>
		</div>
	{/each}
</div>
