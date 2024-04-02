import { type CreatePaginationProps, createPagination } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

export function getPaginationData() {
	const NAME = "pagination" as const;
	const PARTS = ["root", "prev-button", "next-button", "page"] as const;

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreatePaginationProps) {
	const { NAME, PARTS } = getPaginationData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const pagination = { ...createPagination(removeUndefined(props)), getAttrs };
	setContext(NAME, pagination);

	return {
		...pagination,
		updateOption: getOptionUpdater(pagination.options),
	};
}

export function getCtx() {
	const { NAME } = getPaginationData();
	return getContext<GetReturn>(NAME);
}
