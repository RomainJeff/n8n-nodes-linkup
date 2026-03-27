---
name: n8n-node-builder
description: Build custom n8n community nodes for publishing to npm. Use when creating new n8n nodes, building node packages, writing INodeTypeDescription, choosing between declarative and programmatic styles, creating credentials files, setting up node file structure, generating codex files, handling node versioning, implementing error handling in execute(), preparing nodes for npm publishing, or scaffolding a new n8n node project.
---

# n8n Node Builder

Expert guidance for building custom n8n community nodes ready for npm publishing.

---

## Quick Start — Scaffold a Working Node

### Step 1: Choose Your Style

```
Is it a simple REST API with standard CRUD?
  YES → Declarative style (JSON routing, no code)
  NO  ↓

Does it need triggers, GraphQL, or complex data transforms?
  YES → Programmatic style (execute() method)
  NO  ↓

Does it need webhook or polling triggers?
  YES → Trigger node (programmatic required)
  NO  → Declarative style (simpler, fewer bugs)
```

### Step 2: Scaffold with CLI

```bash
npx @n8n/create-n8n-nodes-module@latest n8n-nodes-myservice
cd n8n-nodes-myservice
npm install
```

This generates a working starter project with linter, TypeScript config, and example nodes.

### Step 3: File Structure

```
n8n-nodes-myservice/
├── package.json                          # npm package config
├── tsconfig.json                         # TypeScript config
├── credentials/
│   └── MyServiceApi.credentials.ts       # Auth configuration
├── nodes/
│   └── MyService/
│       ├── MyService.node.ts             # Main node class
│       ├── MyService.node.json           # Codex file (metadata)
│       └── myservice.svg                 # Node icon (MUST be SVG)
└── icons/
    ├── myservice.svg                     # Light mode icon
    └── myservice.dark.svg                # Dark mode icon (optional)
```

**Critical naming rule:** Class name = file name = `name` field in description

```
MyService.node.ts → class MyService → name: 'myService'
MyServiceApi.credentials.ts → class MyServiceApi → name: 'myServiceApi'
```

### Step 4: Minimal package.json

```json
{
  "name": "n8n-nodes-myservice",
  "version": "0.1.0",
  "description": "n8n nodes for MyService API",
  "license": "MIT",
  "keywords": ["n8n-community-node-package"],
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/n8n-nodes-myservice.git"
  },
  "scripts": {
    "build": "n8n-node build",
    "dev": "n8n-node dev",
    "lint": "n8n-node lint",
    "lint:fix": "n8n-node lint --fix",
    "prepublishOnly": "n8n-node prerelease"
  },
  "files": ["dist"],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": ["dist/nodes/MyService/MyService.node.js"],
    "credentials": ["dist/credentials/MyServiceApi.credentials.js"]
  },
  "devDependencies": {
    "@n8n/node-cli": ">=0.23.0",
    "eslint": "^9.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
```

**Mandatory fields:**
- `name` starts with `n8n-nodes-` or `@scope/n8n-nodes-`
- `keywords` contains `"n8n-community-node-package"`
- `license` is `"MIT"`
- `n8n.n8nNodesApiVersion` is a number
- `n8n.nodes` lists at least one filepath (dist paths)

### Step 5: Minimal Declarative Node

```typescript
import {
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';

export class MyService implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MyService',
    name: 'myService',
    icon: 'file:myservice.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the MyService API',
    defaults: { name: 'MyService' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: 'myServiceApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.myservice.com/v1',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
        ],
        default: 'contact',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['contact'] },
        },
        options: [
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many contacts',
            action: 'Get many contacts',
            routing: {
              request: {
                method: 'GET',
                url: '/contacts',
              },
            },
          },
          {
            name: 'Create',
            value: 'create',
            description: 'Create a contact',
            action: 'Create a contact',
            routing: {
              request: {
                method: 'POST',
                url: '/contacts',
              },
              send: {
                type: 'body',
                property: 'contact',
              },
            },
          },
        ],
        default: 'getMany',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create'] },
        },
        routing: {
          send: {
            type: 'body',
            property: 'contact.email',
          },
        },
      },
    ],
  };
}
```

### Step 6: Minimal Programmatic Node

```typescript
import {
  NodeConnectionTypes,
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';

export class MyService implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MyService',
    name: 'myService',
    icon: 'file:myservice.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the MyService API',
    defaults: { name: 'MyService' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: 'myServiceApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
        ],
        default: 'contact',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['contact'] },
        },
        options: [
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get many contacts',
            action: 'Get many contacts',
          },
        ],
        default: 'getMany',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'contact') {
          if (operation === 'getMany') {
            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'myServiceApi',
              {
                method: 'GET',
                url: 'https://api.myservice.com/v1/contacts',
                json: true,
              },
            );

            const executionData = this.helpers.constructExecutionMetaData(
              this.helpers.returnJsonArray(response as INodeExecutionData[]),
              { itemData: { item: i } },
            );
            returnData.push(...executionData);
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
```

### Step 7: Minimal Credentials File

```typescript
import type {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyServiceApi implements ICredentialType {
  name = 'myServiceApi';
  displayName = 'MyService API';
  documentationUrl = 'https://docs.myservice.com/auth';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };
}
```

### Step 8: Minimal Codex File

Create `MyService.node.json` next to `MyService.node.ts`:

```json
{
  "node": "n8n-nodes-myservice.myService",
  "nodeVersion": "1.0",
  "codexVersion": "1.0",
  "categories": ["Marketing & Content"],
  "subcategories": {},
  "alias": ["myservice", "contacts"],
  "resources": {
    "primaryDocumentation": [
      { "url": "https://github.com/username/n8n-nodes-myservice" }
    ]
  }
}
```

**Valid categories** (must match exactly):
```
Analytics | Communication | Data & Storage | Development
Finance & Accounting | Marketing & Content | Miscellaneous
Productivity | Sales | Utility
```

### Step 9: Run & Test

```bash
npm run dev    # Starts n8n at localhost:5678 with hot reload
```

Search for your node by **node name** (not package name) in the n8n UI.

---

## Decision Tree — Which Style Do I Need?

```
┌─────────────────────────────────────────────────┐
│ What type of node am I building?                │
├─────────────────────────────────────────────────┤
│ TRIGGER (start workflows) → Programmatic ONLY   │
│ ACTION (process data)     → Continue ↓          │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ Is it a standard REST API?                      │
├─────────────────────────────────────────────────┤
│ YES → Declarative (JSON routing, simpler)       │
│ NO  → Continue ↓                                │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ Does it need: GraphQL, data transforms,         │
│ complex pagination, file uploads, or            │
│ external dependencies?                          │
├─────────────────────────────────────────────────┤
│ YES → Programmatic (execute() method)           │
│ NO  → Declarative (simpler, fewer bugs)         │
└─────────────────────────────────────────────────┘
```

| Feature | Declarative | Programmatic |
|---------|-------------|--------------|
| API calls | Via `routing` key in JSON | Via `execute()` method |
| Trigger nodes | Not supported | Required |
| Full versioning | Not supported | Supported |
| GraphQL / complex logic | Not supported | Required |
| External dependencies | Not supported | Supported |
| Complexity | Simpler, less bugs | More control |

---

## INodeTypeDescription — Required & Optional Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `displayName` | string | Human-readable name shown in UI |
| `name` | string | Internal identifier, camelCase, unique |
| `group` | string[] | `['transform']`, `['trigger']`, or `['input']` |
| `version` | number | Start at `1`, increment for breaking changes |
| `description` | string | One-liner shown under node name |
| `defaults` | object | `{ name: 'Display Name' }` |
| `inputs` | array | `[NodeConnectionTypes.Main]` (action) or `[]` (trigger) |
| `outputs` | array | `[NodeConnectionTypes.Main]` |
| `properties` | INodeProperties[] | All user-configurable parameters |

### Important Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `icon` | string/Icon | `'file:icon.svg'` or `{ light: '...', dark: '...' }` |
| `subtitle` | string | Expression shown below name (e.g., `'={{$parameter["operation"]}}'`) |
| `credentials` | array | Credential types this node can use |
| `requestDefaults` | object | Default baseURL, headers for declarative nodes |
| `usableAsTool` | boolean | `true` to enable AI agent tool usage |
| `polling` | boolean | `true` for poll-based trigger nodes |
| `webhooks` | array | Webhook definitions for webhook trigger nodes |

---

## Properties Quick Reference

All parameters use `INodeProperties` interface:

```typescript
{
  displayName: 'Field Label',    // MUST be first property
  name: 'fieldName',             // camelCase
  type: 'string',                // see types below
  default: '',                   // REQUIRED for all types
  required: true,                // omit if false (don't write required: false)
  description: 'What this does',
  noDataExpression: true,        // REQUIRED for resource & operation params
  displayOptions: {              // conditional visibility
    show: { resource: ['contact'], operation: ['create'] },
  },
}
```

### Parameter Types

| Type | Widget | Default | Notes |
|------|--------|---------|-------|
| `string` | Text input | `''` | Use `typeOptions.password: true` for secrets |
| `number` | Numeric input | `0` | `typeOptions.minValue`, `typeOptions.maxValue` |
| `boolean` | Toggle | `false` | Description must start with "Whether" |
| `options` | Dropdown (single) | first value | Each option needs `name`, `value`, `description` |
| `multiOptions` | Dropdown (multi) | `[]` | Same as options but returns array |
| `collection` | Collapsible group | `{}` | Optional fields group. Items NOT required |
| `fixedCollection` | Repeatable group | `{}` | `typeOptions.multipleValues: true` for repeats |
| `json` | JSON editor | `''` | For raw JSON input |
| `color` | Color picker | `''` | Hex color |
| `dateTime` | Date picker | `''` | ISO date string |
| `notice` | Info box | `''` | Read-only, no user input |
| `resourceLocator` | Search + browse | `{}` | Complex — see UI_ELEMENTS.md |
| `resourceMapper` | Schema mapper | `{}` | Complex — see UI_ELEMENTS.md |
| `filter` | Condition builder | `{}` | Complex — see UI_ELEMENTS.md |
| `assignmentCollection` | Key-value builder | `{}` | Complex — see UI_ELEMENTS.md |

**See [UI_ELEMENTS.md](UI_ELEMENTS.md) for complete reference with examples for each type.**

### Resource + Operation Pattern (Most Common)

```typescript
// Resource — ALWAYS has noDataExpression: true
{
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,    // REQUIRED by linter
  options: [
    { name: 'Contact', value: 'contact' },   // SINGULAR names
    { name: 'Deal', value: 'deal' },
  ],
  default: 'contact',
},

// Operation — ALWAYS has noDataExpression: true + action field
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,    // REQUIRED by linter
  displayOptions: { show: { resource: ['contact'] } },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a contact',
      action: 'Create a contact',    // REQUIRED by linter
    },
    {
      name: 'Get Many',
      value: 'getMany',
      description: 'Get many contacts',    // Use "many" not "all"
      action: 'Get many contacts',
    },
  ],
  default: 'create',
},
```

### displayOptions — Conditional Visibility

```typescript
displayOptions: {
  show: {
    resource: ['contact', 'deal'],    // show when resource is contact OR deal
    operation: ['create'],             // AND operation is create
  },
  hide: {
    authentication: ['none'],          // hide when auth is none
  },
}
```

### Additional Fields Pattern (Collection)

```typescript
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: { resource: ['contact'], operation: ['create'] },
  },
  options: [
    {
      displayName: 'Company',
      name: 'company',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Phone',
      name: 'phone',
      type: 'string',
      default: '',
    },
  ],
}
```

**Rule:** Collection items must NOT have `required` property. Collections with 5+ items: sort alphabetically by `name`.

---

## Credentials Quick Reference

### 4 Authentication Patterns

```typescript
// 1. Header auth (Bearer token, API key in header)
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    headers: { Authorization: '=Bearer {{$credentials.apiKey}}' },
  },
};

// 2. Query string auth
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    qs: { api_key: '={{$credentials.apiKey}}' },
  },
};

// 3. Body auth
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    body: {
      username: '={{$credentials.username}}',
      password: '={{$credentials.password}}',
    },
  },
};

// 4. Basic auth (username:password)
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    auth: {
      username: '={{$credentials.username}}',
      password: '={{$credentials.password}}',
    },
  },
};
```

### Naming Conventions

| What | Rule | Example |
|------|------|---------|
| File name | `<Name>.credentials.ts` | `MyServiceApi.credentials.ts` |
| Class name | Suffix with `Api` | `class MyServiceApi` |
| `name` field | camelCase, lowercase first, suffix `Api` | `'myServiceApi'` |
| `displayName` | Title case, end with "API" | `'MyService API'` |
| OAuth2 | Must mention "OAuth2" in class, name, displayName | `MyServiceOAuth2Api` |

### Security Rule

Any field with name containing `secret`, `password`, `token`, or `key` MUST have:
```typescript
typeOptions: { password: true }
```

**See [CREDENTIALS.md](CREDENTIALS.md) for complete reference including OAuth2 and credential testing.**

---

## Codex Files (.node.json)

**File naming:** Must match node base file name. `MyService.node.ts` → `MyService.node.json`

```json
{
  "node": "n8n-nodes-myservice.myService",
  "nodeVersion": "1.0",
  "codexVersion": "1.0",
  "categories": ["Productivity"],
  "subcategories": {},
  "alias": ["myservice", "crm", "contacts"],
  "resources": {
    "primaryDocumentation": [
      { "url": "https://github.com/username/n8n-nodes-myservice" }
    ],
    "credentialDocumentation": [
      { "url": "https://docs.myservice.com/api/auth" }
    ]
  }
}
```

**Valid categories:** `Analytics`, `Communication`, `Data & Storage`, `Development`, `Finance & Accounting`, `Marketing & Content`, `Miscellaneous`, `Productivity`, `Sales`, `Utility`

---

## Execute Method Pattern (Programmatic)

### Standard Loop

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      if (resource === 'contact') {
        if (operation === 'create') {
          const email = this.getNodeParameter('email', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

          const body: IDataObject = { email, ...additionalFields };

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myServiceApi',
            {
              method: 'POST',
              url: 'https://api.myservice.com/v1/contacts',
              body,
              json: true,
            },
          );

          // Item linking — REQUIRED for proper data flow
          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray(response as INodeExecutionData[]),
            { itemData: { item: i } },
          );
          returnData.push(...executionData);
        }
      }
    } catch (error) {
      // continueOnFail — REQUIRED by linter
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: (error as Error).message },
          pairedItem: { item: i },
        });
        continue;
      }
      throw error;
    }
  }

  return [returnData];
}
```

### Key Context Methods

| Method | Purpose |
|--------|---------|
| `this.getInputData()` | Get all input items |
| `this.getNodeParameter('name', index)` | Get parameter value for item index |
| `this.getWorkflowStaticData('global')` | Persistent data across executions |
| `this.getCredentials('myServiceApi')` | Get credential values |
| `this.continueOnFail()` | Check if "Continue on Fail" is enabled |

### Key Helper Methods

| Method | Purpose |
|--------|---------|
| `this.helpers.httpRequest(options)` | HTTP request (no auth) |
| `this.helpers.httpRequestWithAuthentication.call(this, 'credName', options)` | HTTP request with auto auth |
| `this.helpers.returnJsonArray(data)` | Wrap response in n8n format |
| `this.helpers.constructExecutionMetaData(data, { itemData: { item: i } })` | Add item linking |

**See [BUILDING_STYLES.md](BUILDING_STYLES.md) for complete declarative routing and programmatic reference.**

---

## Declarative Routing Quick Reference

### Routing on Operations

```typescript
{
  name: 'Get',
  value: 'get',
  routing: {
    request: {
      method: 'GET',
      url: '=/contacts/{{$parameter.contactId}}',
    },
  },
}
```

### Routing on Parameters (send to body)

```typescript
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  routing: {
    send: {
      type: 'body',
      property: 'contact.email',    // nested property path
    },
  },
}
```

### Output Processing (postReceive)

```typescript
routing: {
  request: { method: 'GET', url: '/contacts' },
  output: {
    postReceive: [
      {
        type: 'rootProperty',
        properties: { property: 'data' },    // extract data.contacts from response
      },
    ],
  },
}
```

**See [BUILDING_STYLES.md](BUILDING_STYLES.md) for complete declarative reference including all postReceive types.**

---

## HTTP Helpers

### httpRequest (no auth)

```typescript
const response = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.example.com/data',
  headers: { 'X-Custom': 'value' },
  qs: { page: 1, limit: 50 },
  json: true,
});
```

### httpRequestWithAuthentication (auto auth from credentials)

```typescript
const response = await this.helpers.httpRequestWithAuthentication.call(
  this,
  'myServiceApi',    // credential name — auth applied automatically
  {
    method: 'POST',
    url: 'https://api.example.com/data',
    body: { name: 'test' },
    json: true,
  },
);
```

### Common Options

| Option | Type | Description |
|--------|------|-------------|
| `method` | string | HTTP method |
| `url` | string | Full URL |
| `headers` | object | Additional headers |
| `qs` | object | Query string params |
| `body` | any | Request body |
| `json` | boolean | Parse response as JSON |
| `encoding` | string | Response encoding (`'arraybuffer'` for binary) |
| `returnFullResponse` | boolean | Return headers + status + body |
| `timeout` | number | Request timeout in ms |

---

## Error Handling

### NodeApiError (for API/HTTP errors)

```typescript
import { NodeApiError } from 'n8n-workflow';

try {
  const response = await this.helpers.httpRequest({ ... });
} catch (error) {
  throw new NodeApiError(this.getNode(), error as JsonObject, {
    itemIndex: i,                    // REQUIRED by linter
    message: 'Failed to create contact',
    description: 'Check your API key and permissions',
    httpCode: '401',
  });
}
```

### NodeOperationError (for logic/validation errors)

```typescript
import { NodeOperationError } from 'n8n-workflow';

if (!email) {
  throw new NodeOperationError(
    this.getNode(),
    'Email is required for creating a contact',
    { itemIndex: i },               // REQUIRED by linter
  );
}
```

### continueOnFail Pattern (REQUIRED)

```typescript
for (let i = 0; i < items.length; i++) {
  try {
    // ... node logic
  } catch (error) {
    if (this.continueOnFail()) {
      returnData.push({
        json: { error: (error as Error).message },
        pairedItem: { item: i },
      });
      continue;
    }
    throw error;
  }
}
```

**Linter rules enforced:**
- `node-execute-block-missing-continue-on-fail` — execute() must implement continueOnFail
- `node-execute-block-error-missing-item-index` — NodeApiError/NodeOperationError require itemIndex
- `node-execute-block-wrong-error-thrown` — Only ApplicationError, NodeApiError, NodeOperationError, TriggerCloseError allowed

---

## Versioning Strategies

### Light Versioning (parameter additions only)

Add new parameters with a `displayOptions` version filter:

```typescript
description: INodeTypeDescription = {
  version: [1, 1.1],        // supports both versions
  // ...
  properties: [
    // Existing params...
    {
      displayName: 'New Field',
      name: 'newField',
      type: 'string',
      default: '',
      displayOptions: {
        show: { '@version': [1.1] },    // only in v1.1
      },
    },
  ],
};
```

### Full Versioning (multiple classes)

```typescript
// MyServiceV1.node.ts
export class MyServiceV1 implements INodeType {
  description: INodeTypeDescription = { version: 1, /* ... */ };
  async execute() { /* v1 logic */ }
}

// MyServiceV2.node.ts
export class MyServiceV2 implements INodeType {
  description: INodeTypeDescription = { version: 2, /* ... */ };
  async execute() { /* v2 logic */ }
}

// MyService.node.ts (entry point)
import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { MyServiceV1 } from './MyServiceV1.node';
import { MyServiceV2 } from './MyServiceV2.node';

export class MyService extends VersionedNodeType {
  constructor() {
    const baseDescription: INodeTypeBaseDescription = {
      displayName: 'MyService',
      name: 'myService',
      defaultVersion: 2,     // new workflows use v2
    };
    const nodeVersions: IVersionedNodeType['nodeVersions'] = {
      1: new MyServiceV1(baseDescription),
      2: new MyServiceV2(baseDescription),
    };
    super(nodeVersions, baseDescription);
  }
}
```

### When to Version

- **Light versioning:** Adding optional fields, non-breaking changes
- **Full versioning:** Breaking changes to API, restructured parameters, different behavior
- **Never break existing workflows** — old versions must keep working

---

## Item Linking (Paired Items)

Item linking tracks which output item came from which input item. REQUIRED for proper data flow in programmatic nodes.

```typescript
// Pattern 1: constructExecutionMetaData (recommended)
const executionData = this.helpers.constructExecutionMetaData(
  this.helpers.returnJsonArray(response as INodeExecutionData[]),
  { itemData: { item: i } },
);
returnData.push(...executionData);

// Pattern 2: Manual pairedItem
returnData.push({
  json: responseData,
  pairedItem: { item: i },
});
```

**Always set pairedItem** — even in error cases (see continueOnFail pattern above).

---

## Development Workflow

```bash
# 1. Start development with hot reload
npm run dev

# 2. Build for production
npm run build

# 3. Lint (check)
npm run lint

# 4. Lint (auto-fix)
npm run lint:fix

# 5. Publish to npm
npm publish
```

### Local Testing with npm link (alternative to npm run dev)

```bash
npm run build
npm link
cd ~/.n8n/custom && npm link n8n-nodes-myservice
n8n start
```

### Docker Testing

Copy `dist/` files to `~/.n8n/custom/` in the Docker container.

---

## Pre-Publish Checklist

### Package

- [ ] Package name starts with `n8n-nodes-` or `@scope/n8n-nodes-`
- [ ] `keywords` contains `"n8n-community-node-package"`
- [ ] `license` is `"MIT"`
- [ ] `author.name` and `author.email` filled (not defaults)
- [ ] `description` filled (not default)
- [ ] `repository.url` points to real repo
- [ ] `n8n.n8nNodesApiVersion` is a number
- [ ] `n8n.nodes` and `n8n.credentials` list all dist paths

### Node Files

- [ ] SVG icon present in node directory
- [ ] `subtitle` defined in node description
- [ ] Resource/operation params have `noDataExpression: true`
- [ ] All operations have `action` property
- [ ] Codex `.node.json` file present and named correctly

### Credentials

- [ ] Class name suffixed with `Api`
- [ ] `name` field: camelCase, lowercase first, suffixed `Api`
- [ ] `displayName` field: title case, ends with "API"
- [ ] Sensitive fields have `typeOptions.password: true`
- [ ] `documentationUrl` set (full HTTP URL for community nodes)

### Execute Method

- [ ] `continueOnFail` implemented in try-catch
- [ ] `NodeApiError`/`NodeOperationError` include `itemIndex`
- [ ] Item linking (pairedItem) set on all outputs

### Quality

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run dev` tested in n8n UI
- [ ] README with usage examples written
- [ ] GitHub repository is public

**See [QUALITY_AND_PUBLISHING.md](QUALITY_AND_PUBLISHING.md) for complete linter rules catalog and publishing workflow.**

---

## Reference Files

| File | Content |
|------|---------|
| [BUILDING_STYLES.md](BUILDING_STYLES.md) | Declarative vs Programmatic deep dive with full examples |
| [CREDENTIALS.md](CREDENTIALS.md) | All auth patterns, OAuth2, naming, credential testing |
| [TRIGGER_NODES.md](TRIGGER_NODES.md) | Poll, webhook, and event trigger patterns |
| [UI_ELEMENTS.md](UI_ELEMENTS.md) | All 16+ parameter types, resourceLocator, dynamic methods |
| [QUALITY_AND_PUBLISHING.md](QUALITY_AND_PUBLISHING.md) | Linter rules catalog, testing, npm publishing, verification |

---

## Related Skills

- **n8n-node-configuration** — How users configure nodes (understand the consumer side)
- **n8n-validation-expert** — Validation error patterns
- **n8n-workflow-patterns** — How nodes fit into workflow architectures
- **n8n-expression-syntax** — Expression syntax used in node parameters
