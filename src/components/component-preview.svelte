<script lang="ts">
	import { dev } from "$app/environment";
	import * as Tabs from "@/components/ui/tabs";
	import { cn } from "@/utils";
	let className: string;
	export let align: "center" | "start" | "end" = "center";
	export { className as class };
</script>

{#if dev}
	<div class={cn("group relative my-4 flex flex-col space-y-2", className)} {...$$restProps}>
		<Tabs.Root value="preview" class="relative mr-auto w-full">
			<div class="flex items-center justify-between pb-3">
				<Tabs.List class="w-full justify-start rounded-none border-b bg-transparent p-0">
					<Tabs.Trigger
						value="preview"
						class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
					>
						Preview
					</Tabs.Trigger>
					<Tabs.Trigger
						value="code"
						class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
					>
						Code
					</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="preview" class="relative rounded-md border">
				<div
					class={cn(
						"preview flex min-h-[350px] w-full justify-center p-10",
						{
							"items-center": align === "center",
							"items-start": align === "start",
							"items-end": align === "end"
						},
						className
					)}
				>
					<slot name="preview" />
				</div>
			</Tabs.Content>
			<Tabs.Content value="code">
				<div class="w-full rounded-md ![&_pre]:mt-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
					<slot />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}
