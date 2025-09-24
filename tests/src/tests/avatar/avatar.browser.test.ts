import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import AvatarTest from "./avatar-test.svelte";

const src = "https://github.com/huntabyte.png";

function setup(props: { src: string }) {
	render(AvatarTest, { ...props });
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		setup({ src });
		const root = page.getByTestId("root");
		const image = page.getByTestId("image");
		const fallback = page.getByTestId("fallback");
		await expect.element(root).toHaveAttribute("data-avatar-root");
		await expect.element(image).toHaveAttribute("data-avatar-image");
		await expect.element(fallback).toHaveAttribute("data-avatar-fallback");
	});
});

describe("Rendering Behavior", () => {
	it("should render the image with the correct src", async () => {
		setup({ src });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
	});

	it("should render the fallback when an invalid image src is provided", async () => {
		setup({ src: "invalid" });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).not.toBeVisible();
		const fallback = page.getByText("HJ");
		await expect.element(fallback).toBeVisible();
	});

	it("should remove the avatar when the src is removed", async () => {
		setup({ src });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
		const clearButton = page.getByTestId("clear-button");
		await clearButton.click();
		await expect.element(avatar).not.toBeVisible();
		await expect.element(page.getByText("HJ")).toBeVisible();
	});

	it("should not have invalid style on the fallback if the image is not loaded", async () => {
		setup({ src: "invalid" });
		const fallback = page.getByText("HJ");
		await expect.element(fallback).not.toHaveStyle({ display: "undefined" });
	});
});
