<script lang="ts">
	import { dev } from "$app/environment";
	import PreviewSwitch from "./preview-switch.svelte";
	import { cn } from "@/utils";
	let className: string;
	export let align: "center" | "start" | "end" = "center";
	export { className as class };

	let showCode = false;
</script>

{#if dev}
	<div
		class={cn("group relative my-4 flex flex-col space-y-2", className)}
		{...$$restProps}
		data-preview
	>
		<div class="relative mr-auto w-full">
			<div class="absolute rounded-none bg-transparent p-0 z-20 top-5 right-4">
				<PreviewSwitch bind:checked={showCode} />
			</div>
			{#if showCode}
				<div>
					<div class="w-full rounded-md ![&_pre]:mt-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
						<slot />
					</div>
				</div>
			{:else}
				<div class="relative rounded-md bg-secondary border border-border">
					<div
						class={cn(
							"preview flex min-h-[350px] w-full justify-center p-12",
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
				</div>
			{/if}
		</div>
	</div>
{/if}
