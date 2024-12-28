import { type AnyFn, addEventListener, executeCallbacks } from "svelte-toolbelt";

export class IsUsingKeyboard {
	current = $state(false);

	constructor() {
		$effect(() => {
			const callbacksToDispose: AnyFn[] = [];

			const handlePointer = (_: PointerEvent) => {
				this.current = false;
			};

			const handleKeydown = (_: KeyboardEvent) => {
				this.current = true;

				const disposePointerDown = addEventListener(
					document,
					"pointerdown",
					handlePointer,
					{ capture: true, once: true }
				);

				const disposePointerMove = addEventListener(
					document,
					"pointermove",
					handlePointer,
					{
						capture: true,
						once: true,
					}
				);

				callbacksToDispose.push(disposePointerDown, disposePointerMove);
			};

			const disposeKeydown = addEventListener(document, "keydown", handleKeydown, {
				capture: true,
			});

			callbacksToDispose.push(disposeKeydown);

			return () => {
				executeCallbacks(callbacksToDispose);
			};
		});
	}
}
