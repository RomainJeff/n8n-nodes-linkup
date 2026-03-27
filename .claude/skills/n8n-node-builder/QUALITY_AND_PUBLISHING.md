# Quality & Publishing — Linter Rules, Testing, and npm Publishing

Complete reference for quality gates, the full linter rules catalog, testing procedures, and publishing workflow.

---

## Linter Setup

The linter (`eslint-plugin-n8n-nodes-base`) is included automatically when using the n8n-nodes-starter or `@n8n/create-n8n-nodes-module`.

```bash
# Check for issues
npm run lint

# Auto-fix what can be fixed
npm run lint:fix
```

The linter runs automatically:
- After `npm install` (postinstall hook)
- Before `npm publish` (prepublishOnly hook)

### ESLint Configuration

```js
// Recommended: Plugin + config mode (rules enabled by default)
{
  plugins: ["eslint-plugin-n8n-nodes-base"],
  extends: ["plugin:n8n-nodes-base/nodes"]
}
```

Three config presets: `nodes`, `credentials`, `community`

### Making Lint Exceptions

In VS Code: hover over issue → Quick Fix (Cmd+.) → "Disable {rule} for this line".

Only disable rules when you have a valid reason. Report false positives in the linter repository.

---

## Complete Linter Rules Catalog

### Community Package JSON Rules (19 rules — all non-fixable)

| Rule | Requirement |
|------|-------------|
| `community-package-json-author-missing` | `author` key required |
| `community-package-json-author-name-missing` | `author.name` required |
| `community-package-json-author-name-still-default` | `author.name` must differ from template default |
| `community-package-json-author-email-still-default` | `author.email` must differ from template default |
| `community-package-json-description-missing` | `description` required |
| `community-package-json-description-still-default` | `description` must differ from default |
| `community-package-json-keywords-missing` | `keywords` required |
| `community-package-json-keywords-without-official-tag` | Must include `'n8n-community-node-package'` |
| `community-package-json-license-missing` | `license` required |
| `community-package-json-license-not-default` | `license` must be `MIT` |
| `community-package-json-n8n-missing` | `n8n` key required |
| `community-package-json-n8n-api-version-missing` | `n8n.n8nNodesApiVersion` required |
| `community-package-json-n8n-api-version-not-number` | `n8n.n8nNodesApiVersion` must be number |
| `community-package-json-n8n-nodes-missing` | `n8n.nodes` required |
| `community-package-json-n8n-nodes-empty` | `n8n.nodes` must have at least one filepath |
| `community-package-json-name-missing` | `name` required |
| `community-package-json-name-still-default` | `name` must differ from template default |
| `community-package-json-repository-url-still-default` | `repository.url` must differ from template |
| `community-package-json-version-missing` | `version` required |

### Credential Rules (16 rules — most autofixable)

| Rule | Description | Fix |
|------|-------------|-----|
| `cred-class-field-authenticate-type-assertion` | `authenticate` must type as `IAuthenticateGeneric` | Auto |
| `cred-class-field-display-name-miscased` | `displayName` requires title casing | Auto |
| `cred-class-field-display-name-missing-api` | `displayName` must end with "API" | Auto |
| `cred-class-field-display-name-missing-oauth2` | OAuth2 creds must mention "OAuth2" in displayName | No |
| `cred-class-field-documentation-url-miscased` | `documentationUrl` must be camelCased (core only) | Auto |
| `cred-class-field-documentation-url-missing` | `documentationUrl` required | Auto |
| `cred-class-field-documentation-url-not-http-url` | Must be HTTP URL (community nodes) | No |
| `cred-class-field-name-missing-oauth2` | OAuth2 creds must mention "OAuth2" in name | No |
| `cred-class-field-name-unsuffixed` | `name` must suffix with "Api" | Auto |
| `cred-class-field-name-uppercase-first-char` | `name` must begin lowercase | Auto |
| `cred-class-field-placeholder-url-missing-eg` | URL placeholders must prepend "e.g." | Auto |
| `cred-class-field-properties-assertion` | `properties` must type as `INodeProperties` | Auto |
| `cred-class-field-type-options-password-missing` | Sensitive fields need `typeOptions.password: true` | Auto |
| `cred-class-name-missing-oauth2-suffix` | OAuth2 class names must mention "OAuth2" | No |
| `cred-class-name-unsuffixed` | Class names must suffix with "Api" | Auto |
| `cred-filename-against-convention` | Filename must match class name | No |

### Node Class Description Rules (11 rules)

| Rule | Description | Fix |
|------|-------------|-----|
| `node-class-description-credentials-name-unsuffixed` | Credential `name` must suffix with "Api" | Auto |
| `node-class-description-display-name-unsuffixed-trigger-node` | Trigger displayName must suffix with "Trigger" | Auto |
| `node-class-description-empty-string` | `description` must be filled | No |
| `node-class-description-icon-not-svg` | Icon should be SVG format | No |
| `node-class-description-inputs-wrong-regular-node` | Regular nodes: 1 input | Auto |
| `node-class-description-inputs-wrong-trigger-node` | Trigger nodes: 0 inputs | Auto |
| `node-class-description-missing-subtitle` | `subtitle` must be present | Auto |
| `node-class-description-name-miscased` | `name` requires camelCasing | Auto |
| `node-class-description-name-unsuffixed-trigger-node` | Trigger name must suffix with "Trigger" | Auto |
| `node-class-description-non-core-color-present` | `color` deprecated for non-Font-Awesome icons | Auto |
| `node-class-description-outputs-wrong` | Regular: 1 output, If: 2, Switch: 4 | Auto |

### Execute Block Rules (4 rules — all non-fixable)

| Rule | Description |
|------|-------------|
| `node-execute-block-error-missing-item-index` | `NodeApiError`/`NodeOperationError` require `itemIndex` as 3rd arg |
| `node-execute-block-missing-continue-on-fail` | `execute()` must implement `continueOnFail` in try-catch |
| `node-execute-block-wrong-error-thrown` | Only ApplicationError, NodeApiError, NodeOperationError, TriggerCloseError |
| `node-execute-block-double-assertion-for-items` | Remove double type assertions for `items.length` |

### Node Parameter — Default Value Rules (10 rules — all autofixable)

| Rule | Requirement |
|------|-------------|
| `node-param-default-missing` | `default` required (except under `modes`) |
| `node-param-default-wrong-for-boolean` | Boolean default must be boolean |
| `node-param-default-wrong-for-collection` | Collection default must be `{}` |
| `node-param-default-wrong-for-fixed-collection` | Fixed collection default must be `{}` |
| `node-param-default-wrong-for-limit` | Limit default must be `50` |
| `node-param-default-wrong-for-multi-options` | Multi-options default must be `[]` |
| `node-param-default-wrong-for-number` | Number default must be numeric |
| `node-param-default-wrong-for-options` | Options default must match available options |
| `node-param-default-wrong-for-simplify` | Simplify default must be `true` |
| `node-param-default-wrong-for-string` | String default must be string |

### Node Parameter — Description Rules (8 key rules)

| Rule | Required Text |
|------|--------------|
| `node-param-description-wrong-for-dynamic-options` | `'Choose from the list, or specify an ID...'` |
| `node-param-description-wrong-for-dynamic-multi-options` | `'Choose from the list, or specify IDs...'` |
| `node-param-description-wrong-for-limit` | `'Max number of results to return'` |
| `node-param-description-wrong-for-return-all` | `'Whether to return all results or only up to a given limit'` |
| `node-param-description-wrong-for-simplify` | `'Whether to return a simplified version...'` |
| `node-param-description-wrong-for-upsert` | `'Create a new record, or update the current one...'` |
| `node-param-description-wrong-for-ignore-ssl-issues` | `'Whether to connect even if SSL...'` |
| `node-param-description-boolean-without-whether` | Boolean descriptions must start with "Whether" |

### Node Parameter — Display Name Rules (6 key rules)

| Rule | Requirement | Fix |
|------|-------------|-----|
| `node-param-display-name-miscased` | Title casing required | Auto |
| `node-param-display-name-miscased-id` | "ID" must be fully uppercase | Auto |
| `node-param-display-name-wrong-for-dynamic-options` | Must end with "Name or ID" | No |
| `node-param-display-name-wrong-for-dynamic-multi-options` | Must end with "Names or IDs" | No |
| `node-param-display-name-wrong-for-simplify` | Must be "Simplify" | Auto |
| `node-param-display-name-wrong-for-update-fields` | Update ops must use "Update Fields" | Auto |

### Node Parameter — Other Important Rules

| Rule | Description | Fix |
|------|-------------|-----|
| `node-param-type-options-password-missing` | Secrets/tokens need `typeOptions.password` | Auto |
| `node-param-required-false` | Remove `required: false` (implied) | Auto |
| `node-param-resource-with-plural-option` | Resource options must be singular | No |
| `node-param-operation-without-no-data-expression` | Operation needs `noDataExpression: true` | Auto |
| `node-param-resource-without-no-data-expression` | Resource needs `noDataExpression: true` | Auto |
| `node-param-collection-type-unsorted-items` | 5+ items: sort alphabetically | No |
| `node-param-options-type-unsorted-items` | 5+ items: sort alphabetically | No |
| `node-param-display-name-not-first-position` | displayName must be first property | No |
| `node-resource-description-filename-against-convention` | Singular form: `UserDescription.ts` | No |

---

## Testing

### Method 1: npm run dev (Recommended)

```bash
npm run dev    # compiles + starts n8n at localhost:5678 with hot reload
```

Search by **node name** in the UI, not package name.

### Method 2: npm link

```bash
npm run build
npm link
cd ~/.n8n/custom && npm link n8n-nodes-myservice
n8n start
```

If `~/.n8n/custom` doesn't exist, create it and run `npm init` inside.

### Method 3: Docker

Copy `dist/` files to `~/.n8n/custom/` in the Docker container.

### n8n Scanner (Pre-Publish Check)

```bash
npx @n8n/scan-community-package n8n-nodes-myservice
```

---

## Publishing to npm

### Step 1: Build & Lint

```bash
npm run build
npm run lint      # must pass with zero errors
```

### Step 2: Publish

```bash
npm publish
```

### GitHub Actions with Provenance (Required for Verified Nodes)

**From May 1, 2026**: Verified community nodes MUST be published via GitHub Actions with provenance. Local machine publishing will be rejected.

#### Option A: npm Trusted Publishers (Recommended — No Token Needed)

1. On npmjs.com → Package settings → Publish access → Trusted Publishers
2. Add GitHub Actions publisher:
   - Repository owner: your GitHub username/org
   - Repository name: your repo name
   - Workflow name: `publish.yml`

#### Option B: npm Granular Access Token

1. Create Granular Access Token on npmjs.com
2. Store as `NPM_TOKEN` in GitHub repo Actions secrets

#### GitHub Actions Workflow

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write    # Required for provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Notes:**
- Private repos cannot generate provenance (even for public packages)
- Trusted publishing only works with cloud-hosted runners
- Provenance lets anyone verify build source, repo, and commit

---

## Verification Requirements (for Official Verified Nodes)

### Technical Requirements

- [ ] No runtime dependencies (none at all)
- [ ] No environment variable access
- [ ] No file system read/write
- [ ] Linter passes (`npx @n8n/scan-community-package`)
- [ ] TypeScript only
- [ ] Each node directory includes `icon.svg`
- [ ] Built with `n8n-node` CLI
- [ ] Node.js v22+

### Documentation Requirements

- [ ] README with usage examples
- [ ] Authentication details documented
- [ ] Clear parameter names, descriptions, help text
- [ ] Clear error messages

### UX Requirements

- [ ] Follow n8n UX guidelines
- [ ] All user-facing text is clear and professional

### Publishing Requirements

- [ ] License: MIT
- [ ] Published from GitHub Actions with provenance
- [ ] Repository is public
- [ ] npm package `repository.url` matches GitHub repo

### What n8n Will Reject

- Nodes that compete with n8n paid/enterprise features
- Logic or flow control nodes
- Iterations on existing nodes (submit PR to n8n instead)

---

## Pre-Publish Checklist (Complete)

### Package.json

- [ ] Name starts with `n8n-nodes-` or `@scope/n8n-nodes-`
- [ ] `keywords` contains `"n8n-community-node-package"`
- [ ] `license` is `"MIT"`
- [ ] `author.name` and `author.email` filled (not defaults)
- [ ] `description` filled (not default template text)
- [ ] `repository.url` points to real GitHub repo
- [ ] `n8n.n8nNodesApiVersion` is a number
- [ ] `n8n.nodes` lists all node `.js` files (dist paths)
- [ ] `n8n.credentials` lists all credential `.js` files (dist paths)
- [ ] `@n8n/node-cli` version >= 0.23.0

### Node Files

- [ ] SVG icon present in each node directory
- [ ] `subtitle` defined in node description
- [ ] Resource and Operation params have `noDataExpression: true`
- [ ] All operations have `action` property
- [ ] Operation descriptions use proper verbs (Create, Get Many, Update, Delete)
- [ ] Resource names are singular (Contact, not Contacts)
- [ ] Codex `.node.json` file present and correctly named

### Credentials

- [ ] Class name suffixed with "Api" (or "OAuth2Api")
- [ ] `name` field: camelCase, lowercase first, suffixed "Api"
- [ ] `displayName`: title case, ends with "API"
- [ ] `documentationUrl`: full HTTP URL
- [ ] Sensitive fields have `typeOptions.password: true`
- [ ] URL placeholders prepend "e.g."
- [ ] Credential test (`test` property) defined

### Execute Method (Programmatic Nodes)

- [ ] `continueOnFail` implemented in try-catch
- [ ] `NodeApiError`/`NodeOperationError` include `itemIndex`
- [ ] Only allowed error types thrown
- [ ] Item linking (pairedItem/constructExecutionMetaData) on all outputs
- [ ] Return format: `INodeExecutionData[][]`

### Parameter Quality

- [ ] All params have `default` value
- [ ] Boolean defaults are boolean (not string)
- [ ] Collection defaults are `{}`
- [ ] Limit defaults are `50`
- [ ] Boolean descriptions start with "Whether"
- [ ] Dynamic option descriptions use standardized text
- [ ] Options with 5+ items sorted alphabetically
- [ ] `displayName` is always first property in definition
- [ ] Title casing on all display names
- [ ] "ID" is fully uppercase in display names

### Final Steps

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run dev` tested manually in n8n UI
- [ ] README documentation written
- [ ] GitHub repository is public
- [ ] Published via GitHub Actions with provenance (for verified nodes)
