<script lang="ts">
	import { mount, onMount, unmount } from "svelte";
	import AlertDialog from "./alert-dialog.svelte";

	async function makeAlert(message: string) {
		const component = mount(AlertDialog, {
			props: {
				title: `Loading ${message}`,
				message: message,
			},
			target: document.body,
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));
		await unmount(component);
	}

	async function badAlert() {
		// doesnt work
		await makeAlert("number 1");
		await makeAlert("number2");

		// hacky fix
		// await makeAlert('number 1');
		// await new Promise((resolve) => setTimeout(resolve, 500));
		// await makeAlert('number2');

		// works
		// await makeAlert('1');
	}

	let bodyPointerEventsNone = $state(
		typeof document !== "undefined" && document.body.style.pointerEvents === "none"
	);

	onMount(() => {
		const interval = setInterval(() => {
			if (document.body.style.pointerEvents === "none") {
				bodyPointerEventsNone = true;
			} else {
				bodyPointerEventsNone = false;
			}
		}, 250);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if bodyPointerEventsNone}
	<div class="fixed left-0 top-0 z-50 w-full bg-red-500 py-2 text-center text-white">
		POINTER EVENTS NOT ALLOWED
	</div>
{/if}

<div
	class="fixed left-1/2 top-1/2 z-40 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center {bodyPointerEventsNone
		? 'bg-red-500/70'
		: 'bg-slate-900'}"
>
	<button class="rounded-md bg-blue-500 px-4 py-2 text-white" onclick={badAlert}>
		Bad Alert
	</button>
</div>
