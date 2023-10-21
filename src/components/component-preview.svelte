<script lang="ts">
	import { dev } from "$app/environment";
	import * as Tabs from "@/components/ui/tabs";
	import { cn } from "@/utils";
	let className: string;
	export let align: "center" | "start" | "end" = "center";
	export { className as class };
</script>

{#if dev}
	<div
		class={cn("group relative my-4 flex flex-col space-y-2", className)}
		{...$$restProps}
		data-preview
	>
		<Tabs.Root value="preview" class="relative mr-auto w-full">
			<div class="flex items-center justify-between">
				<Tabs.List
					class="absolute w-full justify-end rounded-none bg-transparent p-0 z-20 top-5 right-4"
				>
					<Tabs.Trigger
						value="preview"
						class="relative h-9 rounded-lg bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-background data-[state=active]:text-foreground hover:bg-primary/5 transition-all"
					>
						Preview
					</Tabs.Trigger>
					<Tabs.Trigger
						value="code"
						class="relative h-9 rounded-lg bg-muted px-3 py-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-background data-[state=active]:text-foreground hover:bg-primary/5 transition-all"
					>
						&lt;Code/&gt;
					</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="preview" class="relative rounded-md bg-muted">
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
