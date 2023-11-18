<script lang="ts">
	import * as Popover from "@/components/ui/popover";
	import * as Label from "@/components/ui/label";
	import * as Button from "@/components/ui/button";
	import * as Input from "@/components/ui/input";
	import { tick } from "svelte";
	import { flyAndScale } from "@/utils";

	let open = false;
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger
		class="inline-flex h-12 items-center
	justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini ring-dark ring-offset-background transition-colors hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		Open
	</Popover.Trigger>
	<Popover.Content
		class="w-full max-w-[300px] rounded-xl border border-muted bg-background p-5 shadow-popover outline-none"
		transition={flyAndScale}
	>
		<div class="grid gap-4">
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Dimensions</h4>
				<p class="text-sm text-muted-foreground">
					Set the dimensions for the layer.
				</p>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-3 items-center gap-4">
					<Label.Root for="width">Width</Label.Root>
					<Input.Root id="width" value="100%" class="col-span-2 h-8" />
				</div>
				<div class="grid grid-cols-3 items-center gap-4">
					<Label.Root for="maxWidth">Max. width</Label.Root>
					<Input.Root id="maxWidth" value="300px" class="col-span-2 h-8" />
				</div>
				<div class="grid grid-cols-3 items-center gap-4">
					<Label.Root for="height">Height</Label.Root>
					<Input.Root id="height" value="25px" class="col-span-2 h-8" />
				</div>
				<div class="grid grid-cols-3 items-center gap-4">
					<Label.Root for="maxHeight">Max. height</Label.Root>
					<Input.Root id="maxHeight" value="none" class="col-span-2 h-8" />
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
