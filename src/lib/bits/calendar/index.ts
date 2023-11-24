import Root from "./components/Calendar.svelte";
import Date from "./components/CalendarDate.svelte";
import Grid from "./components/CalendarGrid.svelte";
import GridBody from "./components/CalendarGridBody.svelte";
import Cell from "./components/CalendarCell.svelte";
import GridHead from "./components/CalendarGridHead.svelte";
import HeadCell from "./components/CalendarHeadCell.svelte";
import GridRow from "./components/CalendarGridRow.svelte";
import Header from "./components/CalendarHeader.svelte";
import Heading from "./components/CalendarHeading.svelte";
import NextButton from "./components/CalendarNextButton.svelte";
import PrevButton from "./components/CalendarPrevButton.svelte";

export {
	Root,
	Date,
	Grid,
	GridBody,
	Cell,
	GridHead,
	HeadCell,
	GridRow,
	Header,
	Heading,
	NextButton,
	PrevButton,
	//
	Root as Calendar,
	Date as CalendarDate,
	Grid as CalendarGrid,
	GridBody as CalendarGridBody,
	Cell as CalendarGridBodyCell,
	GridHead as CalendarGridHead,
	HeadCell as CalendarGridHeadCell,
	GridRow as CalendarGridRow,
	Header as CalendarHeader,
	Heading as CalendarHeading,
	NextButton as CalendarNextButton,
	PrevButton as CalendarPrevButton
};
export * from "./types.js";
