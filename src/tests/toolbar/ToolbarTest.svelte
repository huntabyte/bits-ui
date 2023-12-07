<script lang="ts">
	import { Toolbar } from "$lib";

	type $$Props = Toolbar.Props & {
		multipleProps?: Toolbar.GroupProps<"multiple">;
		singleProps?: Toolbar.GroupProps<"single">;
	};

	export let multipleProps: $$Props["multipleProps"] = undefined;
	export let singleProps: $$Props["singleProps"] = undefined;

	let style: string[] | undefined = ["bold"];
	let align: string | undefined;
</script>

<main>
	<button data-testid="style-binding" on:click={() => (style = ["italic"])}>
		{style}
	</button>

	<button data-testid="align-binding" on:click={() => (align = "center")}>
		{align}
	</button>

	<Toolbar.Root data-testid="root" {...$$restProps}>
		<Toolbar.Group
			data-testid="group-multiple"
			bind:value={style}
			type="multiple"
			{...multipleProps}
		>
			<Toolbar.GroupItem
				data-testid="group-multiple-bold"
				aria-label="toggle bold"
				value="bold"
			>
				Bold
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-multiple-italic"
				aria-label="toggle italic"
				value="italic"
			>
				Italic
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-multiple-strikethrough"
				aria-label="toggle strikethrough"
				value="strikethrough"
			>
				Strikethrough
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Toolbar.Group
			data-testid="group-single"
			bind:value={align}
			type="single"
			{...singleProps}
		>
			<Toolbar.GroupItem
				data-testid="group-single-left"
				aria-label="align left"
				value="left"
			>
				Left
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-single-center"
				aria-label="align center"
				value="center"
			>
				Center
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-single-right"
				aria-label="align right"
				value="right"
			>
				Right
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Toolbar.Link data-testid="link">Edited 2 hours ago</Toolbar.Link>

		<Toolbar.Button data-testid="button">Save</Toolbar.Button>
	</Toolbar.Root>
</main>
