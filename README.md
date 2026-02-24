# crawl4ai-mcp-server

An MCP (Model Context Protocol) server that wraps a [Crawl4AI](https://github.com/unclecode/crawl4ai) instance, giving Claude the ability to crawl and extract content from web pages.

## Prerequisites

- Node.js >= 18
- A running Crawl4AI server

## Installation

### Add to Claude Code (directly from GitHub)

```bash
claude mcp add crawl4ai -- npx github:ril3y/crawl4ai-mcp-server http://your-server:11235
```

### Add to Claude Code (from local clone)

```bash
claude mcp add crawl4ai -- node /path/to/crawl4ai-mcp-server/src/index.js http://your-server:11235
```

## Usage

The server URL is a **required** argument:

```
crawl4ai-mcp-server <crawl4ai-url>
```

You can also set it via the `CRAWL4AI_BASE_URL` environment variable as a fallback.

## Tools

| Tool | Description |
|------|-------------|
| `health` | Check if the Crawl4AI server is running |
| `crawl` | Crawl a URL and return markdown + cleaned HTML |
| `crawl_markdown` | Crawl a URL and return only the markdown content |

### Crawl Parameters

- **url** (required) - The URL to crawl
- **word_count_threshold** - Minimum word count for content blocks (default: 10)
- **bypass_cache** - Force a fresh crawl, ignoring cache (default: false)
- **css_selector** - CSS selector to extract specific page sections

## License

MIT
