import { getContext as getSvelteContext, hasContext, setContext as setSvelteContext } from "svelte";

function setContext<T>(key: symbol, value: T): T {
	return setSvelteContext(key, value);
}

function getContext<T>(key: symbol, fallback?: T): T {
	if (!hasContext(key)) {
		if (fallback === undefined) {
			throw new Error(
				`Missing context dependency: ${key.description} and no fallback was provided.`
			);
		}
		return fallback as T;
	}
	return getSvelteContext(key);
}

export function createContext<ContextValue>(
	providerComponentName: string | string[],
	contextName?: string
) {
	const symbolDescription =
		typeof providerComponentName === "string" && !contextName
			? `${providerComponentName}Context`
			: contextName;

	const contextKey = Symbol(symbolDescription);

	function getCtx<T extends ContextValue | null | undefined = ContextValue>(
		fallback?: T
	): T extends null ? ContextValue | null : ContextValue {
		const context = getContext<T>(contextKey, fallback);
		if (context === undefined) {
			throw new Error(
				`Context \`${contextKey.description}\` not found. Component must be used within ${
					Array.isArray(providerComponentName)
						? `one of the following components: ${providerComponentName.join(", ")}`
						: `\`${providerComponentName}\``
				}`
			);
		}
		// eslint-disable-next-line ts/no-explicit-any
		if (context === null) return context as any;
		return context;
	}

	function setCtx(value: ContextValue): ContextValue {
		return setContext(contextKey, value);
	}

	return [setCtx, getCtx] as const;
}
