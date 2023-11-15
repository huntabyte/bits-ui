<script lang="ts">
	import { Tabs } from "$lib";
	import { dev } from "$app/environment";
	import { cn } from "@/utils";
	import { buttonVariants } from "./ui/button";
	let className: string;
	export let align: "center" | "start" | "end" = "center";
	export { className as class };
</script>

{#if dev}
	<div
		class={cn("group relative mb-4 flex flex-col space-y-2", className)}
		{...$$restProps}
		data-preview
	>
		<Tabs.Root class="relative mr-auto w-full" let:value>
			<Tabs.List class="absolute z-20 top-5 right-4 flex items-center">
				<Tabs.Trigger
					value="preview"
					class={cn(
						buttonVariants(),
						value === "preview"
							? "bg-background font-semibold shadow-mini hover:bg-opacity-90"
							: "bg-transparent shadow-none hover:bg-background"
					)}
				>
					Preview
				</Tabs.Trigger>
				<Tabs.Trigger
					value="code"
					class={cn(
						buttonVariants(),
						value === "code"
							? "bg-background font-semibold shadow-mini hover:bg-opacity-90"
							: "bg-transparent shadow-none hover:bg-background hover:shadow-mini"
					)}>&lt;Code&gt;</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="code">
				<div
					class="w-full ![&_pre]:mt-0 [&_pre]:max-h-[443px] [&_pre]:min-h-[443px] [&_pre]:overflow-auto ![&_pre]:rounded-card"
				>
					<slot />
				</div>
			</Tabs.Content>
			<Tabs.Content value="preview" class="relative bg-muted rounded-card">
				<div
					class={cn(
						"preview flex min-h-[443px] w-full justify-center p-12",
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
		</Tabs.Root>
	</div>
{/if}
