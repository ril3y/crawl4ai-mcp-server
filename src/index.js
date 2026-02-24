#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CRAWL4AI_BASE_URL = process.argv[2] || process.env.CRAWL4AI_BASE_URL;

if (!CRAWL4AI_BASE_URL) {
  console.error("Usage: crawl4ai-mcp-server <crawl4ai-url>");
  console.error("Example: crawl4ai-mcp-server http://192.168.1.206:11235");
  process.exit(1);
}

async function makeRequest(path, options = {}) {
  const url = `${CRAWL4AI_BASE_URL}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Crawl4AI request failed (${response.status}): ${text}`);
  }
  return response.json();
}

const server = new McpServer({
  name: "crawl4ai",
  version: "1.0.0",
});

// Health check tool
server.tool(
  "health",
  "Check if the Crawl4AI server is running and healthy",
  {},
  async () => {
    try {
      const result = await makeRequest("/health");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Crawl4AI server is unreachable: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Crawl tool - the main workhorse
server.tool(
  "crawl",
  "Crawl a URL and extract its content as markdown and cleaned HTML. Use this to fetch and read web page content.",
  {
    url: z.string().url().describe("The URL to crawl"),
    word_count_threshold: z
      .number()
      .int()
      .optional()
      .default(10)
      .describe("Minimum word count threshold for content blocks (default: 10)"),
    bypass_cache: z
      .boolean()
      .optional()
      .default(false)
      .describe("Bypass the server-side cache and force a fresh crawl"),
    css_selector: z
      .string()
      .optional()
      .describe("CSS selector to extract only specific parts of the page"),
  },
  async ({ url, word_count_threshold, bypass_cache, css_selector }) => {
    try {
      const body = { url, word_count_threshold, bypass_cache };
      if (css_selector) {
        body.css_selector = css_selector;
      }

      const result = await makeRequest("/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Crawl failed for ${result.url}: ${result.error || "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }

      const parts = [`# Crawl Result: ${result.url}\n`];

      if (result.markdown) {
        parts.push("## Markdown Content\n");
        parts.push(result.markdown);
      }

      if (result.cleaned_html) {
        parts.push("\n## Cleaned HTML\n");
        parts.push("```html");
        parts.push(result.cleaned_html);
        parts.push("```");
      }

      return {
        content: [
          {
            type: "text",
            text: parts.join("\n"),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error crawling ${url}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Crawl and return only markdown
server.tool(
  "crawl_markdown",
  "Crawl a URL and return only the extracted markdown content. Lighter-weight than full crawl.",
  {
    url: z.string().url().describe("The URL to crawl"),
    word_count_threshold: z
      .number()
      .int()
      .optional()
      .default(10)
      .describe("Minimum word count threshold for content blocks (default: 10)"),
    bypass_cache: z
      .boolean()
      .optional()
      .default(false)
      .describe("Bypass the server-side cache and force a fresh crawl"),
    css_selector: z
      .string()
      .optional()
      .describe("CSS selector to extract only specific parts of the page"),
  },
  async ({ url, word_count_threshold, bypass_cache, css_selector }) => {
    try {
      const body = { url, word_count_threshold, bypass_cache };
      if (css_selector) {
        body.css_selector = css_selector;
      }

      const result = await makeRequest("/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Crawl failed for ${result.url}: ${result.error || "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: result.markdown || "No markdown content extracted.",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error crawling ${url}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
