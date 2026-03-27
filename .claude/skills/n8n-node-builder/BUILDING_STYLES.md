# Building Styles — Declarative vs Programmatic

Complete reference for both n8n node building styles with full working examples.

---

## Side-by-Side Comparison

| Aspect | Declarative | Programmatic |
|--------|-------------|--------------|
| API calls | Via `routing` key in JSON properties | Via `execute()` method in TypeScript |
| Trigger nodes | Not supported | Required |
| Full versioning | Not supported | Supported |
| GraphQL / complex logic | Not supported | Required |
| External dependencies | Not supported | Supported |
| Data transforms | postReceive only | Full TypeScript |
| File uploads/downloads | Not supported | Supported |
| Pagination | Built-in (limited) | Full control |
| Error handling | Automatic | Manual (try/catch) |
| Complexity | Simpler, less bugs | More control, more code |

**Rule of thumb:** Start declarative. Switch to programmatic only when you hit a wall.

---

## Declarative Style — Complete Reference

### How It Works

Declarative nodes define API calls in JSON through `routing` keys on operations and parameters. n8n handles the HTTP call, auth injection, and response parsing automatically.

### Routing Architecture

```
User fills in params → n8n reads routing keys → Builds HTTP request → Injects auth → Sends request → Applies postReceive → Returns data
```

Three places to put routing:

1. **On operations** — defines the HTTP method + URL
2. **On parameters** — sends parameter values as body/qs/headers
3. **On output** — transforms the response

### Request Routing (on operations)

```typescript
{
  name: 'Get',
  value: 'get',
  routing: {
    request: {
      method: 'GET',
      url: '=/contacts/{{$parameter.contactId}}',    // expressions supported
    },
  },
}
```

**Available request properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `method` | HTTP method | `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`, `'PATCH'` |
| `url` | Path (appended to requestDefaults.baseURL) | `'/contacts'` |
| `baseURL` | Override requestDefaults.baseURL | `'https://other-api.com'` |
| `headers` | Additional headers | `{ 'X-Custom': 'value' }` |
| `qs` | Query string parameters | `{ page: 1 }` |
| `body` | Request body | `{ name: 'test' }` |
| `encoding` | Response encoding | `'arraybuffer'` |
| `returnFullResponse` | Return status + headers + body | `true` |
| `ignoreHttpStatusErrors` | Don't throw on 4xx/5xx | `true` |

**Expressions in URLs:** Use `=` prefix for expression URLs:
```typescript
url: '=/contacts/{{$parameter.contactId}}'
// Resolves to: /contacts/12345
```

### Send Routing (on parameters)

Sends parameter values to the request body, query string, or headers.

```typescript
// Send to body
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  routing: {
    send: {
      type: 'body',
      property: 'email',              // body.email = value
    },
  },
}

// Send to nested body property
{
  displayName: 'City',
  name: 'city',
  type: 'string',
  routing: {
    send: {
      type: 'body',
      property: 'address.city',       // body.address.city = value
    },
  },
}

// Send to query string
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  routing: {
    send: {
      type: 'query',
      property: 'page',               // ?page=value
    },
  },
}

// Send to headers
{
  displayName: 'Custom Header',
  name: 'customHeader',
  type: 'string',
  routing: {
    send: {
      type: 'headers',
      property: 'X-Custom',           // X-Custom: value
    },
  },
}

// Send with pre-fill value (sent even if user doesn't fill the field)
{
  displayName: 'Format',
  name: 'format',
  type: 'string',
  routing: {
    send: {
      type: 'query',
      property: 'format',
      value: 'json',                   // always sends ?format=json
      preSend: [],
    },
  },
}
```

### Output Routing (postReceive)

Transform the API response before returning it to the workflow.

```typescript
routing: {
  request: { method: 'GET', url: '/contacts' },
  output: {
    postReceive: [
      // Extract nested property from response
      {
        type: 'rootProperty',
        properties: {
          property: 'data.contacts',    // response.data.contacts
        },
      },
    ],
  },
}
```

**Available postReceive types:**

| Type | Purpose | Example |
|------|---------|---------|
| `rootProperty` | Extract nested array from response | `{ property: 'data.items' }` |
| `filter` | Filter response items | `{ property: 'status', value: 'active' }` |
| `set` | Add/set a property on each item | `{ value: '={{ { source: "api" } }}' }` |
| `setKeyValue` | Set specific key-value pairs | `{ key: 'id', value: '={{$responseItem.id}}' }` |
| `sort` | Sort results | `{ property: 'name' }` |
| `limit` | Limit number of results | Uses the `limit` parameter |
| `binaryData` | Handle binary data responses | For file downloads |

### Pre-Send Functions

Transform request data before sending:

```typescript
{
  displayName: 'Tags',
  name: 'tags',
  type: 'string',
  routing: {
    send: {
      preSend: [
        // Custom function to transform value before sending
        async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
          const tags = this.getNodeParameter('tags') as string;
          requestOptions.body = requestOptions.body || {};
          (requestOptions.body as IDataObject).tags = tags.split(',').map(t => t.trim());
          return requestOptions;
        },
      ],
    },
  },
}
```

### Complete Declarative Example — NASA APOD

```typescript
import {
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';

export class NasaPics implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'NASA Pics',
    name: 'nasaPics',
    icon: 'file:nasapics.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Get data from NASA open APIs',
    defaults: { name: 'NASA Pics' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: 'nasaPicsApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.nasa.gov',
      headers: { Accept: 'application/json' },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Astronomy Picture of the Day', value: 'astronomyPictureOfTheDay' },
          { name: 'Mars Rover Photo', value: 'marsRoverPhoto' },
        ],
        default: 'astronomyPictureOfTheDay',
      },
      // --- APOD Operations ---
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['astronomyPictureOfTheDay'] } },
        options: [
          {
            name: 'Get',
            value: 'get',
            action: 'Get the astronomy picture of the day',
            description: 'Get the astronomy picture of the day',
            routing: {
              request: {
                method: 'GET',
                url: '/planetary/apod',
              },
            },
          },
        ],
        default: 'get',
      },
      // --- APOD Additional Fields ---
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        default: {},
        placeholder: 'Add Field',
        displayOptions: {
          show: { resource: ['astronomyPictureOfTheDay'], operation: ['get'] },
        },
        options: [
          {
            displayName: 'Date',
            name: 'date',
            type: 'dateTime',
            default: '',
            description: 'The date of the APOD image to retrieve (YYYY-MM-DD)',
            routing: {
              send: {
                type: 'query',
                property: 'date',
              },
            },
          },
        ],
      },
      // --- Mars Rover Operations ---
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['marsRoverPhoto'] } },
        options: [
          {
            name: 'Get Many',
            value: 'getMany',
            action: 'Get many Mars rover photos',
            description: 'Get many Mars rover photos',
            routing: {
              request: {
                method: 'GET',
                url: '/mars-photos/api/v1/rovers/curiosity/photos',
              },
              output: {
                postReceive: [
                  {
                    type: 'rootProperty',
                    properties: { property: 'photos' },
                  },
                ],
              },
            },
          },
        ],
        default: 'getMany',
      },
      {
        displayName: 'Sol',
        name: 'sol',
        type: 'number',
        default: 1000,
        description: 'Martian rotation or day on which image was taken',
        displayOptions: {
          show: { resource: ['marsRoverPhoto'], operation: ['getMany'] },
        },
        routing: {
          send: { type: 'query', property: 'sol' },
        },
      },
    ],
  };
}
```

---

## Programmatic Style — Complete Reference

### How It Works

Programmatic nodes implement an `execute()` method that receives input items, processes them with full TypeScript access, and returns output items.

### Execute Method Signature

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // 'this' is bound to IExecuteFunctions context
  // Returns array of arrays (one per output)
  // Most nodes have 1 output: return [returnData]
}
```

### Standard Execute Pattern

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
          // Get parameters for this item
          const email = this.getNodeParameter('email', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
          const body: IDataObject = { email, ...additionalFields };

          // Make API call
          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myServiceApi',
            { method: 'POST', url: 'https://api.myservice.com/v1/contacts', body, json: true },
          );

          // Add item linking
          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray(response as INodeExecutionData[]),
            { itemData: { item: i } },
          );
          returnData.push(...executionData);

        } else if (operation === 'getMany') {
          const returnAll = this.getNodeParameter('returnAll', i) as boolean;
          const limit = this.getNodeParameter('limit', i, 50) as number;

          let responseData: IDataObject[];

          if (returnAll) {
            responseData = await getAllItems.call(this);
          } else {
            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'myServiceApi',
              { method: 'GET', url: 'https://api.myservice.com/v1/contacts', qs: { limit }, json: true },
            );
            responseData = (response as IDataObject).data as IDataObject[];
          }

          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray(responseData),
            { itemData: { item: i } },
          );
          returnData.push(...executionData);

        } else if (operation === 'delete') {
          const contactId = this.getNodeParameter('contactId', i) as string;

          await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myServiceApi',
            { method: 'DELETE', url: `https://api.myservice.com/v1/contacts/${contactId}`, json: true },
          );

          // Return success indicator
          returnData.push({
            json: { success: true, id: contactId },
            pairedItem: { item: i },
          });
        }
      }
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

  return [returnData];
}
```

### Context Methods (IExecuteFunctions)

| Method | Returns | Description |
|--------|---------|-------------|
| `this.getInputData()` | `INodeExecutionData[]` | All input items |
| `this.getNodeParameter('name', i)` | `any` | Parameter value for item `i` |
| `this.getNodeParameter('name', i, default)` | `any` | With fallback default |
| `this.getCredentials('credName')` | `ICredentialDataDecryptedObject` | Decrypted credentials |
| `this.getWorkflowStaticData('global')` | `IDataObject` | Persistent data across executions |
| `this.getNode()` | `INode` | Current node metadata |
| `this.getMode()` | `string` | Execution mode (`'manual'`, `'trigger'`, etc.) |
| `this.getTimezone()` | `string` | Workflow timezone |
| `this.continueOnFail()` | `boolean` | Whether "Continue on Fail" is enabled |
| `this.getWorkflow()` | `Workflow` | Workflow metadata |
| `this.getExecutionId()` | `string` | Current execution ID |

### Helper Methods (this.helpers)

| Method | Description |
|--------|-------------|
| `httpRequest(options)` | HTTP request without auth |
| `httpRequestWithAuthentication.call(this, 'cred', options)` | HTTP request with auto credential injection |
| `requestWithAuthentication.call(this, 'cred', options)` | Legacy HTTP helper (use httpRequestWithAuthentication instead) |
| `returnJsonArray(data)` | Wrap raw JSON in INodeExecutionData format |
| `constructExecutionMetaData(data, { itemData: { item: i } })` | Add item linking to output data |
| `prepareBinaryData(buffer, fileName, mimeType)` | Create binary data from buffer |
| `getBinaryDataBuffer(itemIndex, propertyName)` | Get binary data as buffer |
| `assertBinaryData(itemIndex, propertyName)` | Assert binary data exists |

### Pagination Helper

```typescript
// Manual pagination
async function getAllItems(this: IExecuteFunctions): Promise<IDataObject[]> {
  const allItems: IDataObject[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'myServiceApi',
      {
        method: 'GET',
        url: 'https://api.myservice.com/v1/contacts',
        qs: { page, limit: 100 },
        json: true,
      },
    );

    const data = (response as IDataObject).data as IDataObject[];
    allItems.push(...data);

    hasMore = data.length === 100;
    page++;
  }

  return allItems;
}
```

### Binary Data Handling

```typescript
// Download file
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    const fileUrl = this.getNodeParameter('fileUrl', i) as string;

    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: fileUrl,
      encoding: 'arraybuffer',
      returnFullResponse: true,
    });

    const binaryData = await this.helpers.prepareBinaryData(
      response.body as Buffer,
      'downloaded-file.pdf',
      response.headers['content-type'] as string,
    );

    returnData.push({
      json: { fileName: 'downloaded-file.pdf' },
      binary: { data: binaryData },
      pairedItem: { item: i },
    });
  }

  return [returnData];
}
```

### Multiple Outputs (If/Switch pattern)

```typescript
description: INodeTypeDescription = {
  // ...
  outputs: [NodeConnectionTypes.Main, NodeConnectionTypes.Main],    // 2 outputs
  outputNames: ['True', 'False'],
};

async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const trueItems: INodeExecutionData[] = [];
  const falseItems: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    const condition = this.getNodeParameter('condition', i) as boolean;
    if (condition) {
      trueItems.push({ json: items[i].json, pairedItem: { item: i } });
    } else {
      falseItems.push({ json: items[i].json, pairedItem: { item: i } });
    }
  }

  return [trueItems, falseItems];    // array index matches output index
}
```

---

## Resource Description Files Pattern

For nodes with many resources/operations, split properties into separate files:

```
nodes/MyService/
├── MyService.node.ts          # Main class, imports descriptions
├── MyService.node.json        # Codex
├── resources/
│   ├── contact.ts             # Contact resource description
│   ├── deal.ts                # Deal resource description
│   └── company.ts             # Company resource description
└── listSearch/
    ├── getContacts.ts         # Dynamic list search method
    └── getCompanies.ts        # Dynamic list search method
```

### Resource description file pattern

```typescript
// resources/contact.ts
import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contact'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a contact',
        action: 'Create a contact',
      },
      // ...more operations
    ],
    default: 'create',
  },
];

export const contactFields: INodeProperties[] = [
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
  },
  // ...more fields
];

// Combine for export
export const contactDescription: INodeProperties[] = [
  ...contactOperations,
  ...contactFields,
];
```

### Import in main node file

```typescript
// MyService.node.ts
import { contactDescription } from './resources/contact';
import { dealDescription } from './resources/deal';

export class MyService implements INodeType {
  description: INodeTypeDescription = {
    // ...
    properties: [
      // Auth + Resource selector
      { /* resource param */ },
      // Spread all resource descriptions
      ...contactDescription,
      ...dealDescription,
    ],
  };
}
```

**Naming convention:** Resource files use singular form: `contact.ts` not `contacts.ts` (enforced by linter: `node-resource-description-filename-against-convention`).

---

## Sub-nodes / Cluster Nodes

Sub-nodes work as part of another node rather than independently. They use a different connection type.

```typescript
description: INodeTypeDescription = {
  displayName: 'My Tool',
  name: 'myTool',
  group: ['transform'],
  version: 1,
  description: 'A tool node for AI agents',
  defaults: { name: 'My Tool' },
  // Sub-node: uses AI tool connection instead of Main
  inputs: [],
  outputs: [NodeConnectionTypes.AiTool],
  // ...
};
```

Sub-nodes are used primarily for AI agent tool nodes and specialized data processors.

---

## Summary

### When to use Declarative
- Standard REST APIs with CRUD operations
- Simple query string / body parameter passing
- Response extraction with rootProperty
- Simpler code, fewer bugs, faster development

### When to use Programmatic
- Trigger nodes (required)
- GraphQL APIs
- Complex data transformation
- File upload/download
- Custom pagination logic
- Multiple outputs
- External library dependencies
- Full versioning support

### Key Files for Each Style

**Declarative:** Properties define routing → n8n handles HTTP.
- Focus on: `routing.request`, `routing.send`, `routing.output.postReceive`

**Programmatic:** execute() method handles everything.
- Focus on: `this.helpers.httpRequestWithAuthentication`, `constructExecutionMetaData`, `continueOnFail`
