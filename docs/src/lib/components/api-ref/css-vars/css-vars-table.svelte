<script lang="ts">
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { CSSVarSchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";
	import CssVarsDetailsMobile from "./css-vars-details-mobile.svelte";

	let { cssVars = [] }: { cssVars: CSSVarSchema[] } = $props();
</script>

{#if cssVars.length}
	<Table.Root>
		<Table.Header>
			<Table.Row class="w-1/4">
				<Table.Head class="w-[90%] whitespace-nowrap sm:w-[60%]">CSS Variable</Table.Head>
				<Table.Head class="hidden w-[40%] whitespace-nowrap sm:table-cell"
					>Description</Table.Head
				>
				<Table.Head class="sr-only w-[10%] sm:hidden">Details</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each cssVars as attr (attr.name)}
				<Table.Row>
					<Table.Cell class="align-baseline">
						<Code
							class="text-foreground h-fit py-1.5 font-semibold md:py-1 lg:h-[27px] lg:py-0"
							>{attr.name}</Code
						>
					</Table.Cell>
					<Table.Cell class="hidden align-baseline sm:table-cell">
						{#if attr.description}
							<p class="my-2 text-sm leading-7">
								{@html parseMarkdown(attr.description)}
							</p>
						{/if}
					</Table.Cell>
					<Table.Cell class="overflow-hidden py-0 sm:hidden">
						<CssVarsDetailsMobile cssVar={attr} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
