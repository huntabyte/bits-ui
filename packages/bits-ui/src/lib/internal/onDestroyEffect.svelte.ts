export function onDestroyEffect(fn: () => void) {
	$effect(() => {
		return () => {
			fn();
		};
	});
}
