<script lang="ts">
	import { page } from "$app/state";
	import CSSVarsTable from "$lib/components/api-ref/css-vars/css-vars-table.svelte";
	import DataAttrsTable from "$lib/components/api-ref/data-attrs/data-attrs-table.svelte";
	import PropsTable from "$lib/components/api-ref/props/props-table.svelte";
	import { h2 as H2, p as P } from "$lib/components/markdown/index.js";
	import type { APISchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let { schemas = [] }: { schemas: APISchema[] } = $props();
</script>

<H2 id="api-reference">API Reference</H2>

<div class="flex flex-col gap-12 pt-8">
	{#each schemas as schema (schema.title)}
		<div>
			<div
				class="rounded-button bg-accent inline-flex h-[29px] items-center justify-center px-3 font-mono text-[17px] font-medium leading-tight tracking-tight dark:text-neutral-900"
			>
				<h3 class="scroll-m-20 font-semibold" id={schema.title.toLowerCase()}>
					{#if schema.type !== "utility"}
						<span class="text-foreground/80 font-normal dark:text-neutral-900/80"
							>{page.data.metadata.title.replaceAll(" ", "")}.</span
						>{/if}{schema.title}
				</h3>
			</div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<P class="mt-2! mb-5!">{@html parseMarkdown(schema.description)}</P>
			<div class="flex flex-col gap-4">
				{#if schema.props}
					<PropsTable props={schema.props} />
				{/if}
				{#if schema.type === "component"}
					<DataAttrsTable dataAttrs={schema.dataAttributes} />
					<CSSVarsTable cssVars={schema.cssVars} />
				{/if}
				<!-- {#if schema.type === "component"}
					{#if schema.dataAttributes && schema.dataAttributes.length}
						<DataAttrsTable dataAttrs={schema.dataAttributes} />
					{/if}
					{#if schema.cssVars && schema.cssVars.length}
						<CSSVarsTable cssVars={schema.cssVars} />
					{/if}
				{/if} -->
			</div>
		</div>
	{/each}
</div>
