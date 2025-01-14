<script lang="ts">
	import { onMount } from "svelte";
	import Drawer from "./drawer/drawer.svelte";

	onMount(() => {
		console.log("[page] [initial-style-attr]", document.body.getAttribute("style"));
		const bodyStyle = getComputedStyle(document.body);
		console.log("[page] [computed-style]", {
			paddingRight: bodyStyle.paddingRight,
			marginRight: bodyStyle.marginRight,
			pointerEvents: bodyStyle.pointerEvents,
			overflow: bodyStyle.overflow,
		});
		console.log("👆 we want to return to [initial-style-attr] not [computed-style]");
	});
</script>

<main>
	<Drawer>
		{#snippet trigger(open)}
			<span>{open ? "close" : "open"} drawer</span>
		{/snippet}

		{#snippet title()}
			my cool drawer
		{/snippet}

		<div>
			<p>
				lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quisquam animi
				explicabo laudantium.
			</p>
			<p>
				lorem ipsum dolor sit amet consectetur adipisicing elit. Quam libero, necessitatibus
				debitis optio praesentium veniam magnam maxime hic exercitationem quibusdam
				doloribus culpa sint eaque, voluptatum nam doloremque asperiores.
			</p>
		</div>
	</Drawer>

	<p>
		lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cumque quis sit repudiandae
		quasi aliquid qui blanditiis ab ut officia, animi assumenda laborum maiores sunt magni id
		recusandae ex, sapiente incidunt quaerat dolorum maxime quam? Doloribus officia vitae nulla
		porro temporibus voluptatum architecto ipsa, cumque reiciendis earum voluptates, ducimus
		perspiciatis.
	</p>
</main>

<style>
	:global(body) {
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
