<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import cn from "clsx";

	let { items }: { items: string[] } = $props();
</script>

<ul class="m-0 flex list-none flex-col gap-2 p-6">
	{#each items as item (item)}
		<li>
			<NavigationMenu.Link
				class={cn(
					"hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground outline-hidden block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors"
				)}
				href="#"
			>
				<div class="text-sm font-medium leading-none">{item}</div>
			</NavigationMenu.Link>
		</li>
	{/each}
</ul>
