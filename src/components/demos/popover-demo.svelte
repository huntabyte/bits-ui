<script lang="ts">
	import * as Popover from "@/components/ui/popover";
	import * as Label from "@/components/ui/label";
	import * as Button from "@/components/ui/button";
	import * as Input from "@/components/ui/input";

	let open = false;
</script>

<Popover.Root bind:open focusTriggerOnClose={true}>
	<Popover.Trigger asChild let:builder>
		<Button.Root builders={[builder]} variant="outline">Open</Button.Root>
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<div class="grid gap-4">
			<button on:click={() => (open = false)}> close me </button>
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Dimensions</h4>
				<p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
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
