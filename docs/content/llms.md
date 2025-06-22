---
title: LLMs
description: How to access LLM-friendly versions of Bits UI documentation.
---

At the top of each documentation page, you'll find a convenient "Copy Markdown" button alongside a direct link to the LLM-friendly version of that page (e.g., `/llms.txt`). These tools make it easy to copy the content in Markdown format or access the machine-readable `llms.txt` file tailored for that specific page.

Bits UI documentation is designed to be accessible not only to humans but also to large language models (LLMs). We've adopted the [llms.txt](https://llmstxt.org/) proposal standard, which provides a structured, machine-readable format optimized for LLMs. This enables developers, researchers, and AI systems to efficiently parse and utilize our documentation.

## What is llms.txt?

The `llms.txt` standard is an emerging convention for presenting documentation in a simplified, text-based format that's easy for LLMs to process. By following this standard, Bits UI ensures compatibility with AI tools and workflows, allowing seamless integration into LLM-powered applications, research, or automation systems.

## Accessing LLM-friendly Documentation

To access the LLM-friendly version of any supported Bits UI documentation page, simply append `/llms.txt` to the end of the page's URL. This will return the content in a plain-text, LLM-optimized format.

### Example

- **Standard Page**: The Accordion component documentation is available at [bits-ui.com/docs/components/accordion](https://bits-ui.com/docs/components/accordion).
- **LLM-friendly Version**: Append `/llms.txt` to access it at [bits-ui.com/docs/components/accordion/llms.txt](https://bits-ui.com/docs/components/accordion/llms.txt).

### Root Index

To explore all supported pages in LLM-friendly format, visit the root index at [bits-ui.com/llms.txt](https://bits-ui.com/llms.txt). This page provides a comprehensive list of available documentation endpoints compatible with the `llms.txt` standard.

## Full LLM-friendly Documentation

For a complete, consolidated view of the Bits UI documentation in an LLM-friendly format, navigate to [bits-ui.com/docs/llms.txt](https://bits-ui.com/docs/llms.txt). This single endpoint aggregates all documentation content into a machine-readable structure, ideal for bulk processing or ingestion into AI systems.

## Notes

- Not all pages may support the `/llms.txt` suffix (those deemed irrelevant to LLMs, such as the Figma page). Check the root [bits-ui.com/llms.txt](https://bits-ui.com/llms.txt) page for an up-to-date list of compatible URLs.
- The "Copy Markdown" button at the top of each page provides the same content you'd find in the `/llms.txt` of that page.

By embracing the `llms.txt` standard, Bits UI empowers both human developers and AI systems to make the most of our documentation. Whether you're building with Bits UI or training an LLM, these tools are designed to enhance your experience.
