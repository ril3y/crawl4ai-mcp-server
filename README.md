# crawl4ai-mcp-server

An MCP (Model Context Protocol) server that wraps a [Crawl4AI](https://github.com/unclecode/crawl4ai) instance, giving Claude the ability to crawl and extract content from web pages.

## Prerequisites

- Node.js >= 18
- A running Crawl4AI server (default: `http://192.168.1.206:11235`)

## Installation

### Add to Claude Code

```bash
claude mcp add crawl4ai -- node /Users/ril3y/projects/crawl4ai-mcp-server/src/index.js
```

To use a custom Crawl4AI server URL:

```bash
claude mcp add crawl4ai -e CRAWL4AI_BASE_URL=http://your-server:11235 -- node /Users/ril3y/projects/crawl4ai-mcp-server/src/index.js
```

### Install globally via npm

```bash
npm install -g .
claude mcp add crawl4ai -- crawl4ai-mcp-server
```

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

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CRAWL4AI_BASE_URL` | `http://192.168.1.206:11235` | Base URL of your Crawl4AI server |

## License

MIT
