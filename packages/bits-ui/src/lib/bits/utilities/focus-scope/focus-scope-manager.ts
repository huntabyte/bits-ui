import { box } from "svelte-toolbelt";
import { FocusScope } from "./focus-scope.svelte.js";

export class FocusScopeManager {
	static instance: FocusScopeManager;
	#scopeStack = box<FocusScope[]>([]);
	#focusHistory = new WeakMap<FocusScope, HTMLElement>();

	static getInstance() {
		if (!this.instance) {
			this.instance = new FocusScopeManager();
		}
		return this.instance;
	}

	register(scope: FocusScope) {
		const current = this.getActive();
		if (current && current !== scope) {
			current.pause();
		}

		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		this.#scopeStack.current.unshift(scope);
	}

	unregister(scope: FocusScope) {
		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		const next = this.getActive();
		if (next) {
			next.resume();
		}
	}

	getActive(): FocusScope | undefined {
		return this.#scopeStack.current[0];
	}

	setFocusMemory(scope: FocusScope, element: HTMLElement) {
		this.#focusHistory.set(scope, element);
	}

	getFocusMemory(scope: FocusScope): HTMLElement | undefined {
		return this.#focusHistory.get(scope);
	}

	isActiveScope(scope: FocusScope): boolean {
		return this.getActive() === scope;
	}
}
