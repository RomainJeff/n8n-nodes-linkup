# UI Elements — Parameter Types Reference

Complete reference for all n8n node parameter types, advanced UI patterns, and dynamic methods.

---

## Basic Parameter Types

### string

```typescript
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  required: true,
  description: 'The name of the contact',
}
```

**With password masking** (for secrets, tokens, keys):
```typescript
{
  displayName: 'API Key',
  name: 'apiKey',
  type: 'string',
  typeOptions: { password: true },
  default: '',
}
```

**As textarea** (multiline):
```typescript
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  typeOptions: { rows: 4 },
  default: '',
}
```

### number

```typescript
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: {
    minValue: 1,
    // maxValue: 100,    // deprecated for Limit params
  },
  default: 50,           // MUST be 50 for limit params (linter rule)
  description: 'Max number of results to return',    // standardized text
}
```

### boolean

```typescript
{
  displayName: 'Return All',
  name: 'returnAll',
  type: 'boolean',
  default: false,         // MUST be boolean, not string
  description: 'Whether to return all results or only up to a given limit',    // standardized
}
```

**Rule:** Boolean descriptions MUST start with "Whether" (linter: `node-param-description-boolean-without-whether`).

### dateTime

```typescript
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  default: '',
  description: 'The start date for filtering results',
}
```

### color

```typescript
{
  displayName: 'Background Color',
  name: 'backgroundColor',
  type: 'color',
  default: '#ffffff',
}
```

### json

```typescript
{
  displayName: 'Custom Data',
  name: 'customData',
  type: 'json',
  default: '{}',
  description: 'Custom JSON data to send with the request',
}
```

---

## Selection Types

### options (Single Select Dropdown)

```typescript
{
  displayName: 'Method',
  name: 'method',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'GET', value: 'GET', description: 'Retrieve data' },
    { name: 'POST', value: 'POST', description: 'Create data' },
    { name: 'PUT', value: 'PUT', description: 'Replace data' },
    { name: 'DELETE', value: 'DELETE', description: 'Remove data' },
  ],
  default: 'GET',
}
```

**Rules:**
- `default` MUST match an available option value (linter: `node-param-default-wrong-for-options`)
- Options with 5+ items: sort alphabetically by `name` (linter: `node-param-options-type-unsorted-items`)
- Each option needs `name`, `value`, and `description`

### multiOptions (Multi-Select Dropdown)

```typescript
{
  displayName: 'Scopes',
  name: 'scopes',
  type: 'multiOptions',
  options: [
    { name: 'Read', value: 'read' },
    { name: 'Write', value: 'write' },
    { name: 'Admin', value: 'admin' },
  ],
  default: [],              // MUST be array for multiOptions
}
```

---

## Grouping Types

### collection (Optional Fields Group)

Collapsible group of optional fields — the "Additional Fields" pattern.

```typescript
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},              // MUST be object
  options: [
    {
      displayName: 'Company',
      name: 'company',
      type: 'string',
      default: '',
      // Do NOT add required: true in collection items
    },
    {
      displayName: 'Phone',
      name: 'phone',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Tags',
      name: 'tags',
      type: 'string',
      default: '',
    },
  ],
}
```

**Rules:**
- Collection items must NOT have `required` property
- Collections with 5+ items: sort alphabetically by `name`
- `default` MUST be `{}`

### fixedCollection (Repeatable Group)

Group of fields that can be repeated (e.g., custom key-value pairs).

```typescript
{
  displayName: 'Custom Fields',
  name: 'customFields',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,          // allows adding multiple entries
    multipleValueButtonText: 'Add Field',
  },
  default: {},                     // MUST be object
  options: [
    {
      displayName: 'Field',
      name: 'field',
      values: [
        {
          displayName: 'Key',
          name: 'key',
          type: 'string',
          default: '',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
        },
      ],
    },
  ],
}
```

---

## Display Types

### notice (Info Box)

Read-only yellow information box — no user input.

```typescript
{
  displayName: 'Note: This action permanently deletes data and cannot be undone.',
  name: 'deleteNotice',
  type: 'notice',
  default: '',
}
```

---

## Advanced Types

### resourceLocator (Search + Browse + URL + ID)

Lets users find a resource by searching, browsing a list, pasting a URL, or entering an ID.

```typescript
{
  displayName: 'Repository Name or ID',
  name: 'repository',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  modes: [
    // Mode 1: Browse/search from list
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      placeholder: 'Select a repository...',
      typeOptions: {
        searchListMethod: 'getRepositories',    // maps to methods.listSearch
        searchable: true,
        searchFilterRequired: false,
      },
    },
    // Mode 2: Paste URL
    {
      displayName: 'By URL',
      name: 'url',
      type: 'string',
      placeholder: 'https://github.com/owner/repo',
      extractValue: {
        type: 'regex',
        regex: 'https://github\\.com/[^/]+/([^/]+)',    // extracts repo name
      },
      validation: [
        {
          type: 'regex',
          properties: {
            regex: 'https://github\\.com/[^/]+/[^/]+',
            errorMessage: 'Not a valid GitHub repository URL',
          },
        },
      ],
    },
    // Mode 3: Enter ID directly
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      placeholder: 'e.g. 123456789',
      validation: [
        {
          type: 'regex',
          properties: {
            regex: '[0-9]+',
            errorMessage: 'Not a valid numeric ID',
          },
        },
      ],
    },
  ],
}
```

**Display name for resourceLocator with list mode:**
- Single select: must end with "Name or ID" (linter: `node-param-display-name-wrong-for-dynamic-options`)
- Multi select: must end with "Names or IDs" (linter: `node-param-display-name-wrong-for-dynamic-multi-options`)

### resourceMapper (Schema Mapper)

Maps input data to an external service's schema. Used for database insert/update operations.

```typescript
{
  displayName: 'Columns',
  name: 'columns',
  type: 'resourceMapper',
  default: {
    mappingMode: 'defineBelow',
    value: null,
  },
  typeOptions: {
    loadOptionsDependsOn: ['table.value'],
    resourceMapper: {
      resourceMapperMethod: 'getColumns',
      mode: 'upsert',
      fieldWords: { singular: 'column', plural: 'columns' },
      addAllFields: true,
      multiKeyMatch: true,
    },
  },
}
```

### filter (Condition Builder)

Structured condition builder (used by If, Switch, Filter nodes).

```typescript
{
  displayName: 'Conditions',
  name: 'conditions',
  type: 'filter',
  default: {},
  typeOptions: {
    filter: {
      caseSensitive: '={{!$parameter.options.ignoreCase}}',
      typeValidation: 'strict',
    },
  },
}
```

### assignmentCollection (Key-Value Builder)

For setting/updating fields dynamically.

```typescript
{
  displayName: 'Fields to Set',
  name: 'assignments',
  type: 'assignmentCollection',
  default: {},
  typeOptions: {
    multipleValues: true,
  },
}
```

---

## Dynamic Display Options

### Conditional Visibility (displayOptions)

```typescript
// Show when resource is 'contact' AND operation is 'create'
displayOptions: {
  show: {
    resource: ['contact'],
    operation: ['create'],
  },
}

// Show when resource is 'contact' OR 'deal'
displayOptions: {
  show: {
    resource: ['contact', 'deal'],
  },
}

// Hide when authentication is 'none'
displayOptions: {
  hide: {
    authentication: ['none'],
  },
}

// Version-specific (for light versioning)
displayOptions: {
  show: {
    '@version': [1.1],    // only show in v1.1+
  },
}
```

### typeOptions Reference

| typeOption | Applies To | Description |
|-----------|------------|-------------|
| `password: true` | string | Mask input (REQUIRED for secrets) |
| `rows: 4` | string | Textarea height |
| `multipleValues: true` | fixedCollection | Allow adding multiple entries |
| `multipleValueButtonText` | fixedCollection | Custom "Add" button text |
| `minValue: 1` | number | Minimum value |
| `maxValue: 100` | number | Maximum value |
| `numberStepSize: 0.1` | number | Step increment |
| `loadOptionsMethod: 'getOptions'` | options/multiOptions | Dynamic option loading |
| `loadOptionsDependsOn: ['field']` | options/multiOptions | Reload when field changes |
| `searchListMethod: 'search'` | resourceLocator | Search method name |
| `searchable: true` | resourceLocator list | Enable search in list |

---

## Dynamic Methods

### loadOptions (Dynamic Dropdown Values)

Load dropdown options from an API at runtime.

```typescript
// In node description
{
  displayName: 'Team Name or ID',
  name: 'teamId',
  type: 'options',
  typeOptions: {
    loadOptionsMethod: 'getTeams',
  },
  default: '',
  description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
}

// In node class
methods = {
  loadOptions: {
    async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
      const credentials = await this.getCredentials('myServiceApi');
      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'myServiceApi',
        {
          method: 'GET',
          url: 'https://api.myservice.com/teams',
          json: true,
        },
      );

      const teams = (response as { data: Array<{ id: string; name: string }> }).data;
      return teams.map((team) => ({
        name: team.name,
        value: team.id,
      }));
    },
  },
};
```

**Description for dynamic options** (linter-enforced standardized text):
- Single select: `'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>'`
- Multi select: `'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>'`

### listSearch (Search-Based Resource Picker)

For resourceLocator `list` mode — provides search + browse functionality.

```typescript
// In resourceLocator definition
typeOptions: {
  searchListMethod: 'getRepositories',
  searchable: true,
}

// In node class
methods = {
  listSearch: {
    async getRepositories(
      this: ILoadOptionsFunctions,
      filter?: string,
    ): Promise<INodeListSearchResult> {
      const qs: Record<string, string> = {};
      if (filter) {
        qs.q = filter;
      }

      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'myServiceApi',
        {
          method: 'GET',
          url: 'https://api.myservice.com/repos',
          qs,
          json: true,
        },
      );

      const repos = (response as { items: Array<{ id: number; full_name: string }> }).items;

      return {
        results: repos.map((repo) => ({
          name: repo.full_name,
          value: repo.id.toString(),
          url: `https://myservice.com/${repo.full_name}`,    // optional — shown as link
        })),
        paginationToken: undefined,    // for paginated results
      };
    },
  },
};
```

### credentialTest (Custom Credential Validation)

For complex credential testing beyond simple HTTP GET.

```typescript
// In credential class
test: ICredentialTestRequest = {
  request: {
    baseURL: 'https://api.myservice.com',
    url: '/me',
    method: 'GET',
  },
};

// OR in node class (for complex validation)
methods = {
  credentialTest: {
    async myServiceApiTest(
      this: ICredentialTestFunctions,
      credential: ICredentialsDecrypted,
    ): Promise<INodeCredentialTestResult> {
      const { apiKey, region } = credential.data as Record<string, string>;

      try {
        await this.helpers.httpRequest({
          method: 'GET',
          url: `https://${region}.api.myservice.com/me`,
          headers: { Authorization: `Bearer ${apiKey}` },
          json: true,
        });
        return { status: 'OK', message: 'Authentication successful' };
      } catch (error) {
        return {
          status: 'Error',
          message: `Authentication failed: ${(error as Error).message}`,
        };
      }
    },
  },
};
```

---

## Standard Parameter Patterns

### Return All + Limit Pattern

```typescript
{
  displayName: 'Return All',
  name: 'returnAll',
  type: 'boolean',
  default: false,
  description: 'Whether to return all results or only up to a given limit',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: { minValue: 1 },
  default: 50,
  description: 'Max number of results to return',
  displayOptions: {
    show: { returnAll: [false] },
  },
}
```

### Simplify Pattern

```typescript
{
  displayName: 'Simplify',
  name: 'simplify',
  type: 'boolean',
  default: true,
  description: 'Whether to return a simplified version of the response instead of the raw data',
}
```

### Update Fields Pattern

```typescript
{
  displayName: 'Update Fields',        // MUST be "Update Fields" for update ops
  name: 'updateFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: { resource: ['contact'], operation: ['update'] },
  },
  options: [
    // fields...
  ],
}
```

---

## Standardized Descriptions (Linter-Enforced)

| Parameter | Required Description |
|-----------|---------------------|
| Return All | `'Whether to return all results or only up to a given limit'` |
| Limit | `'Max number of results to return'` |
| Simplify | `'Whether to return a simplified version of the response instead of the raw data'` |
| Dynamic options (single) | `'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>'` |
| Dynamic options (multi) | `'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>'` |
| Upsert | `'Create a new record, or update the current one if it already exists (upsert)'` |
| Ignore SSL | `'Whether to connect even if SSL certificate validation is not possible'` |
| Boolean params | Must start with `'Whether'` |

---

## Summary

### Quick Type Selection

| Need | Use |
|------|-----|
| Simple text input | `string` |
| Sensitive text | `string` + `typeOptions.password: true` |
| Number with limits | `number` + `typeOptions.minValue/maxValue` |
| Yes/no toggle | `boolean` |
| Single choice | `options` |
| Multiple choices | `multiOptions` |
| Optional fields group | `collection` |
| Repeatable key-value pairs | `fixedCollection` |
| Raw JSON input | `json` |
| Resource search/browse | `resourceLocator` |
| Schema mapping | `resourceMapper` |
| Condition building | `filter` |
| Info message | `notice` |
