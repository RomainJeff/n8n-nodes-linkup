# Credentials — Complete Reference

All authentication patterns, OAuth2, naming conventions, credential testing, and security rules for n8n node credentials.

---

## Credential File Structure

```typescript
import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyServiceApi implements ICredentialType {
  // Internal name — camelCase, lowercase first, suffix "Api"
  name = 'myServiceApi';

  // Human-readable — title case, end with "API"
  displayName = 'MyService API';

  // Icon — supports light/dark mode
  icon: Icon = {
    light: 'file:../icons/myservice.svg',
    dark: 'file:../icons/myservice.dark.svg',
  };

  // Documentation URL — must be full HTTP URL for community nodes
  documentationUrl = 'https://docs.myservice.com/api/authentication';

  // User-configurable fields
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },    // REQUIRED for sensitive fields
      default: '',
    },
  ];

  // How to inject auth into requests
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  // Credential test — validates credentials work
  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.myservice.com',
      url: '/me',
      method: 'GET',
    },
  };
}
```

---

## 4 Authentication Patterns

### 1. Header Authentication (Most Common)

Bearer token, API key in header, custom header auth.

```typescript
// Bearer token
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    headers: {
      Authorization: '=Bearer {{$credentials.accessToken}}',
    },
  },
};

// Custom API key header
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    headers: {
      'X-API-Key': '={{$credentials.apiKey}}',
    },
  },
};

// GitHub-style token
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    headers: {
      Authorization: '=token {{$credentials?.accessToken}}',
    },
  },
};
```

### 2. Query String Authentication

API key sent as URL parameter.

```typescript
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    qs: {
      api_key: '={{$credentials.apiKey}}',
    },
  },
};
```

### 3. Body Authentication

Credentials sent in the request body.

```typescript
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    body: {
      username: '={{$credentials.username}}',
      password: '={{$credentials.password}}',
    },
  },
};
```

### 4. Basic Auth (HTTP Basic Authentication)

Username:password encoded in Authorization header.

```typescript
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

---

## OAuth2 Credentials

OAuth2 credentials extend a base OAuth2 class and require additional naming rules.

```typescript
import type {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyServiceOAuth2Api implements ICredentialType {
  // Must mention "OAuth2" in all three: class name, name, displayName
  name = 'myServiceOAuth2Api';
  displayName = 'MyService OAuth2 API';

  // Extend the base OAuth2 credential
  extends = ['oAuth2Api'];

  documentationUrl = 'https://docs.myservice.com/oauth';

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://myservice.com/oauth/authorize',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://myservice.com/oauth/token',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: 'read write',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'header',    // or 'body'
    },
  ];
}
```

### Using OAuth2 in the Node

```typescript
// In node description
credentials: [
  {
    name: 'myServiceOAuth2Api',
    required: true,
    displayOptions: {
      show: { authentication: ['oAuth2'] },
    },
  },
  {
    name: 'myServiceApi',
    required: true,
    displayOptions: {
      show: { authentication: ['accessToken'] },
    },
  },
],
```

---

## Multiple Auth Methods

Support both API key and OAuth2 in the same node:

```typescript
properties: [
  {
    displayName: 'Authentication',
    name: 'authentication',
    type: 'options',
    options: [
      { name: 'Access Token', value: 'accessToken' },
      { name: 'OAuth2', value: 'oAuth2' },
    ],
    default: 'accessToken',
  },
  // ...other properties
],
credentials: [
  {
    name: 'myServiceApi',
    required: true,
    displayOptions: { show: { authentication: ['accessToken'] } },
  },
  {
    name: 'myServiceOAuth2Api',
    required: true,
    displayOptions: { show: { authentication: ['oAuth2'] } },
  },
],
```

---

## Credential Testing

The `test` property validates that credentials work before use.

```typescript
// Simple GET test
test: ICredentialTestRequest = {
  request: {
    baseURL: 'https://api.myservice.com',
    url: '/me',
    method: 'GET',
  },
};

// Test with specific headers
test: ICredentialTestRequest = {
  request: {
    baseURL: 'https://api.myservice.com/v2',
    url: '/account',
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  },
};
```

The credential test runs when the user clicks "Test" in the credentials dialog. Auth is automatically injected via the `authenticate` property.

---

## Naming Conventions

| What | Rule | Example | Linter Rule |
|------|------|---------|-------------|
| File name | `<Name>.credentials.ts` | `MyServiceApi.credentials.ts` | `cred-filename-against-convention` |
| Class name | Suffix with `Api` | `class MyServiceApi` | `cred-class-name-unsuffixed` |
| `name` field | camelCase, lowercase first, suffix `Api` | `'myServiceApi'` | `cred-class-field-name-unsuffixed` |
| `displayName` | Title case, end with "API" | `'MyService API'` | `cred-class-field-display-name-missing-api` |
| OAuth2 class | Mention "OAuth2" in class name | `MyServiceOAuth2Api` | `cred-class-name-missing-oauth2-suffix` |
| OAuth2 name | Mention "OAuth2" in name field | `'myServiceOAuth2Api'` | `cred-class-field-name-missing-oauth2` |
| OAuth2 display | Mention "OAuth2" in displayName | `'MyService OAuth2 API'` | `cred-class-field-display-name-missing-oauth2` |
| Documentation URL | Full HTTP URL (community) | `'https://docs.example.com'` | `cred-class-field-documentation-url-not-http-url` |

---

## Security Rules

### Sensitive Fields MUST Use Password Masking

Any field whose `name` contains: `secret`, `password`, `token`, `key`, or `apiKey`:

```typescript
// REQUIRED — linter enforces this
{
  displayName: 'API Key',
  name: 'apiKey',
  type: 'string',
  typeOptions: { password: true },    // MUST be present
  default: '',
}
```

**Linter rules:**
- `cred-class-field-type-options-password-missing` — credential fields
- `node-param-type-options-password-missing` — node parameter fields

### URL Placeholders Must Use "e.g."

```typescript
{
  displayName: 'Base URL',
  name: 'baseUrl',
  type: 'string',
  default: '',
  placeholder: 'e.g. https://api.myservice.com',    // MUST prepend "e.g."
}
```

---

## Credential Properties Reference

Credential properties use the same `INodeProperties` interface as node parameters:

```typescript
properties: INodeProperties[] = [
  {
    displayName: 'API Key',
    name: 'apiKey',
    type: 'string',
    typeOptions: { password: true },
    default: '',
  },
  {
    displayName: 'Region',
    name: 'region',
    type: 'options',
    options: [
      { name: 'US', value: 'us' },
      { name: 'EU', value: 'eu' },
    ],
    default: 'us',
  },
  {
    displayName: 'Base URL',
    name: 'baseUrl',
    type: 'string',
    default: 'https://api.myservice.com',
    placeholder: 'e.g. https://api.myservice.com',
    description: 'The base URL of your MyService instance',
  },
];
```

### Using Credential Values in Authenticate

```typescript
// Dynamic baseURL from credentials
authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
    headers: {
      Authorization: '=Bearer {{$credentials.apiKey}}',
    },
  },
};

// In programmatic nodes, access credentials directly:
const credentials = await this.getCredentials('myServiceApi');
const baseUrl = credentials.baseUrl as string;
const apiKey = credentials.apiKey as string;
```

---

## Complete Example — Service with Region Selection

```typescript
import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AcmeServiceApi implements ICredentialType {
  name = 'acmeServiceApi';
  displayName = 'Acme Service API';
  documentationUrl = 'https://docs.acme.com/api/auth';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
    {
      displayName: 'Region',
      name: 'region',
      type: 'options',
      options: [
        { name: 'US East', value: 'us-east-1' },
        { name: 'EU West', value: 'eu-west-1' },
        { name: 'AP Southeast', value: 'ap-southeast-1' },
      ],
      default: 'us-east-1',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Api-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '=https://{{$credentials.region}}.api.acme.com',
      url: '/v1/me',
      method: 'GET',
    },
  };
}
```
