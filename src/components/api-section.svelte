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
				class="h-[29px] px-3 bg-accent rounded-button inline-flex items-center justify-center font-mono tracking-tight text-[17px] leading-tight font-medium"
			>
				<h3>
					<span class="text-muted-foreground">{$page.data.title}.</span>{schema.title}
				</h3>
			</div>
			<P class="!mt-2 !mb-5">{schema.description}</P>
			<div class="flex flex-col gap-8">
				{#if schema.props && schema.props.length}
					<PropsTable props={schema.props} />
				{/if}
				{#if schema.dataAttributes && schema.dataAttributes.length}
					<DataAttrsTable dataAttrs={schema.dataAttributes} />
				{/if}
			</div>
		</div>
	{/each}
</div>
