# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package built using n8n's declarative routing architecture (API v1). The package follows modern n8n development patterns where API calls are defined inline in property descriptors rather than in execute() methods.

**Key characteristics:**
- n8n API version: 1 (declarative routing)
- Module system: CommonJS (for n8n compatibility)
- TypeScript: Strict mode, ES2019 target
- All tooling via `@n8n/node-cli`
- Compatible with n8n@1.60.0 or later

## Development Commands

All commands use the official `@n8n/node-cli` tool:

```bash
npm run build         # Compile TypeScript to dist/ (production build)
npm run build:watch   # Watch mode compilation with tsc
npm run dev           # Development mode with n8n-node CLI
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with --fix flag
npm run release       # Create release via n8n-node CLI
```

**Build output:** Compiled JavaScript files are written to `/dist/` directory as CommonJS modules.

## Code Architecture

### Project Structure

```
/nodes/                       # Node implementations
  └── [NodeName]/
      ├── [NodeName].node.ts       # Main node definition (INodeType)
      ├── [NodeName].node.json     # Node metadata
      ├── resources/               # Resource operation implementations
      │   └── [resourceName]/      # Each resource in its own directory
      │       ├── index.ts         # Resource descriptor
      │       └── [operation].ts   # Individual operations (get, getAll, create, etc.)
      ├── shared/                  # Shared utilities
      │   ├── descriptions.ts      # Reusable field descriptors
      │   ├── transport.ts         # API request helper functions
      │   └── utils.ts             # Utility functions
      └── listSearch/              # Dynamic list/search methods for UI dropdowns
          └── [methodName].ts      # Each list search method

/credentials/                 # Authentication credential classes
  └── [Name]Api.credentials.ts    # Credential type definitions

/icons/                       # Node icons (SVG format, light/dark variants)
```

### Declarative Routing Pattern

This package uses n8n's declarative routing system where API calls are defined inline in the property descriptors:

```typescript
{
  name: 'Operation Name',
  value: 'operationValue',
  routing: {
    request: {
      method: 'GET',
      url: '=/api/endpoint/{{$parameter.someParam}}'
    }
  }
}
```

This means most operations don't need an execute() method - n8n handles the HTTP request automatically.

### Main Node Structure

The main node file (`.node.ts`) implements `INodeType` and includes:
- Node metadata (displayName, icon, version, subtitle)
- Credentials configuration (authentication options)
- `requestDefaults` for base URL and headers
- Resource and operation definitions with declarative routing
- `listSearch` methods export for dynamic UI dropdowns
- Optional: `usableAsTool: true` for AI agent capabilities

### Authentication Pattern

Dual authentication support is implemented:

1. **Access Token Authentication** (`[Name]Api.credentials.ts`):
   - Generic header-based authentication
   - Uses `Authorization` header with token
   - Credential test endpoint configured

2. **OAuth2 Authentication** (`[Name]OAuth2Api.credentials.ts`):
   - Extends n8n's `oAuth2Api` credential type
   - Authorization Code flow
   - Requires: Authorization URL, Token URL, Scope

The node presents an authentication selector in the UI, and credentials are injected automatically via n8n's `httpRequestWithAuthentication` helper.

### Transport Layer

API requests use a transport helper function (in `shared/transport.ts`) that:
- Detects authentication type
- Builds request options
- Calls n8n's `httpRequestWithAuthentication` helper
- Handles errors appropriately

### Reusable Field Descriptions

Common field definitions are stored in `shared/descriptions.ts` and reused across operations:
- ResourceLocator types for flexible input (list, URL, ID)
- Consistent field properties (displayName, name, type, required)
- DisplayOptions for conditional visibility
- Default values and placeholders

### Dynamic List Search Methods

List search methods (in `listSearch/`) provide dropdown data for the n8n UI:
- Export async functions returning `INodeListSearchResult`
- Support pagination via `page` parameter
- Include search/filter capabilities
- Return `{ results: [{ name, value, url? }] }`
- Graceful error handling (return empty results on failure)

### Key Development Patterns

**Resource-Operation Organization:**
- Resources: Top-level entities (e.g., User, Project, Task)
- Operations: Actions on resources (e.g., Get, Get Many, Create, Update, Delete)
- Each operation in a separate file for maintainability
- Resource index.ts exports all operations

**DisplayOptions Pattern:**
- Conditional field visibility using `displayOptions.show`
- Example: `{ resource: ['user'], operation: ['get'] }`
- Keeps UI clean and contextual

**Pagination Handling:**
- Link header parsing for pagination (RFC 5988)
- Support for "Return All" with automatic pagination
- Configurable limits per page
- Utility function: `parseLinkHeader()` in shared/utils.ts

**Type Safety:**
- Strong TypeScript types throughout
- API response types defined as interfaces
- Import n8n types from 'n8n-workflow' package

**Error Handling:**
- Try-catch blocks in list search methods
- Graceful degradation on failures
- Informative error messages

## Configuration Files

**package.json n8n section:**
```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "strict": true,
  "credentials": ["dist/credentials/*.credentials.js"],
  "nodes": ["dist/nodes/*/*.node.js"]
}
```

**tsconfig.json:**
- Strict type checking enabled
- Target: ES2019
- Module: CommonJS
- Output: ./dist/
- Declaration files and source maps generated

**Code Style:**
- Prettier: Tabs (width 2), single quotes, trailing commas
- ESLint: Uses n8n's shared configuration
- Line length: 100 characters

## Development Workflow

1. **Adding a new operation:**
   - Create operation file in `resources/[resourceName]/[operation].ts`
   - Define routing configuration inline
   - Add operation to resource index.ts
   - Update node properties if needed

2. **Adding a new resource:**
   - Create directory in `resources/[resourceName]/`
   - Create index.ts with resource descriptor
   - Create operation files
   - Export resource in main node file

3. **Adding list search methods:**
   - Create file in `listSearch/[methodName].ts`
   - Export async function returning `INodeListSearchResult`
   - Add to `listSearch` export in main node file

4. **Modifying authentication:**
   - Update credential files in `/credentials/`
   - Adjust transport layer in `shared/transport.ts`
   - Update authentication selector in main node

5. **Testing changes:**
   - Run `npm run dev` for development mode
   - Use n8n's built-in testing capabilities
   - Lint with `npm run lint:fix` before committing
