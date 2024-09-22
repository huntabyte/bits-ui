<script lang="ts">
	import Item from './item.svelte';
</script>

{#each { length: 6 } as _, i}
	<Item>
		Project {i + 1}
	</Item>
{/each}
