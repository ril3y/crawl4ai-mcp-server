# crawl4ai-mcp-server

An MCP (Model Context Protocol) server that wraps a [Crawl4AI](https://github.com/unclecode/crawl4ai) instance, giving Claude the ability to crawl and extract content from web pages.

## Prerequisites

- Node.js >= 18
- A running [Crawl4AI](https://github.com/unclecode/crawl4ai) server

## Install for Claude Code

```bash
claude mcp add crawl4ai -- npx github:ril3y/crawl4ai-mcp-server http://192.168.1.206:11235
```

Replace `http://192.168.1.206:11235` with your Crawl4AI server URL.

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
