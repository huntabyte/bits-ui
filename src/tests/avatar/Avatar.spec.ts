import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import AvatarTest from "./AvatarTest.svelte";

const src = "https://github.com/huntabyte.png";

describe("Avatar", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(AvatarTest, { src });
		expect(await axe(container)).toHaveNoViolations();
	});

	it("renders the image with the correct src", async () => {
		const { getByAltText } = render(AvatarTest, { src });
		const avatar = getByAltText("huntabyte");
		expect(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
	});

	it("renders the fallback when an invalid image src is provided", async () => {
		const { getByAltText, getByText } = render(AvatarTest, { src: "invalid" });
		const avatar = getByAltText("huntabyte");
		expect(avatar).not.toBeVisible();
		const fallback = getByText("HJ");
		expect(fallback).toBeVisible();
	});

	it("removes the avatar when the src is removed", async () => {
		const user = userEvent.setup();
		const { getByAltText, getByTestId, getByText } = render(AvatarTest, { src });
		const avatar = getByAltText("huntabyte");
		expect(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
		const clearButton = getByTestId("clear-button");
		await user.click(clearButton);
		expect(avatar).not.toBeVisible();
		expect(getByText("HJ")).toBeVisible();
	});
});
