import {
	createPagination,
	type CreatePaginationProps,
	type Pagination as PaginationReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal";

const NAME = "pagination";
const PARTS = ["root", "prev-button", "next-button", "page"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = PaginationReturn;

export function setCtx(props: CreatePaginationProps) {
	const pagination = createPagination(removeUndefined(props));
	setContext(NAME, pagination);

	return {
		...pagination,
		updateOption: getOptionUpdater(pagination.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
