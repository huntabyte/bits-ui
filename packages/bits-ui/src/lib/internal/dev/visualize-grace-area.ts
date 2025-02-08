import type { Polygon } from "../polygon.js";

let graceAreaElement: SVGPolygonElement | null = null;
let svgContainer: SVGSVGElement | null = null;

/**
 * Debugging utility to visualize the grace area of a floating layer component.
 */
export function visualizeGraceArea(graceArea: Polygon) {
	if (graceAreaElement) {
		graceAreaElement.remove();
	}

	if (!svgContainer) {
		svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgContainer.style.position = "absolute";
		svgContainer.style.top = "0";
		svgContainer.style.left = "0";
		svgContainer.style.width = "100%";
		svgContainer.style.height = "100%";
		svgContainer.style.pointerEvents = "none";
		document.body.appendChild(svgContainer);
	}

	graceAreaElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	const pointsString = graceArea.map((p) => `${p.x},${p.y}`).join(" ");
	graceAreaElement.setAttribute("points", pointsString);
	graceAreaElement.setAttribute("fill", "rgba(255, 0, 0, 0.3)");
	graceAreaElement.setAttribute("stroke", "red");
	graceAreaElement.setAttribute("stroke-width", "1");
	graceAreaElement.style.pointerEvents = "none";

	svgContainer.appendChild(graceAreaElement);
}
