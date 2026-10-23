<!-- Stateless-ish primitives mounted `count` times each. -->
<script lang="ts">
	import { AspectRatio, Avatar, Button, Label, Meter, Progress, Separator } from "bits-ui";
	let { count, value = 50 }: { count: number; value?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<AspectRatio.Root ratio={16 / 9}><div></div></AspectRatio.Root>
	<Avatar.Root>
		<Avatar.Image src="" alt="" />
		<Avatar.Fallback>AB</Avatar.Fallback>
	</Avatar.Root>
	<Button.Root>btn</Button.Root>
	<Label.Root for="x{i}">label</Label.Root>
	<Meter.Root {value} max={100} />
	<Progress.Root {value} max={100} />
	<Separator.Root />
{/each}
