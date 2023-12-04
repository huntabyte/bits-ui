/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, ActionReturn } from "svelte/action";

export type Builder<
	Element = any,
	Param = any,
	Attributes extends Record<string, any> = Record<string, any>
> = Record<string, any> & {
	action: Action<Element, Param, Attributes>;
};

type BuilderActionsParams = {
	builders: Builder<any, any, any>[];
};

type BuilderActionsReturn = {
	destroy: () => void;
};

export function builderActions(
	node: HTMLElement,
	params: BuilderActionsParams
): BuilderActionsReturn {
	const unsubs: ActionReturn[] = [];
	params.builders.forEach((builder) => {
		const act = builder.action(node);
		if (act) {
			unsubs.push(act);
		}
	});
	return {
		destroy: () => {
			unsubs.forEach((unsub) => {
				if (unsub.destroy) {
					unsub.destroy();
				}
			});
		}
	};
}

export function getAttrs(builders: Builder<any, any, any>[]) {
	const attrs: Record<string, unknown | undefined> = {};
	builders.forEach((builder) => {
		Object.keys(builder).forEach((key) => {
			if (key !== "action") {
				attrs[key] = builder[key];
			}
		});
	});
	return attrs;
}
