# MCP Configuration Changes - 2025-11-26

## Changes Made

### 1. Added Playwright MCP to project
**File:** `.mcp.json`
```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

### 2. Removed Firecrawl MCP globally
**File:** `~/.claude.json`
- Removed `firecrawl` server entry from `mcpServers`
- Supabase MCP remains intact

## Rollback
To restore firecrawl, add to `~/.claude.json` under `mcpServers`:
```json
"firecrawl": {
  "type": "stdio",
  "command": "env",
  "args": ["FIRECRAWL_API_KEY=fc-9afd73f25a5343b7a33cb9eedda7095c", "npx", "-y", "firecrawl-mcp"],
  "env": {}
}
```
