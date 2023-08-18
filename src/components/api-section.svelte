<script lang="ts">
	import { DataAttrsTable, PropsTable } from "@/components";
	import { h3 as H3, h2 as H2, p as P } from "@/components/markdown";
	import type { APISchema } from "@/types";

	export let schemas: APISchema[] = [];
</script>

<H2>Component API</H2>

<div class="flex flex-col gap-8">
	{#each schemas as schema}
		<div>
			<H3>{schema.title}</H3>
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
