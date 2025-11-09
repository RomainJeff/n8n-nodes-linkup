# n8n-nodes-linkup

This is an n8n community node that integrates the [Linkup API](https://linkup.so) into your n8n workflows. Linkup is a web search engine designed specifically for AI applications, providing reliable and factual grounding data for LLMs.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

**Table of Contents:**
- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Community nodes are installed from npm. The package name is: `n8n-nodes-linkup`

## Operations

This node provides two main operations for interacting with the Linkup API:

### Search

Perform web searches and retrieve context for AI grounding. The search operation returns relevant web content that can be used to ground your AI responses with factual information.

**Configuration Options:**

- **Query** (required): Your natural language search question
- **Depth** (required): Choose search precision level
  - **Standard**: Fast search for straightforward queries (costs 1 credit per search)
  - **Deep**: Comprehensive search for complex queries requiring detailed analysis (costs 10 credits per search)
- **Output Type** (required): Select the response format
  - **Sourced Answer**: Returns a concise answer with source citations
  - **Search Results**: Returns a list of relevant documents
  - **Structured**: Returns data according to a custom JSON schema you define

**Optional Filters:**
- Date range filtering (from/to dates)
- Domain inclusion/exclusion lists
- Include images in results
- Inline citations (for sourced answers)
- Include sources (for structured output)

### Fetch

Fetch and convert any webpage to markdown format. This operation retrieves webpage content and converts it to clean, structured markdown.

**Configuration Options:**

- **URL** (required): The webpage URL you want to fetch
- **Render JavaScript** (optional): Enable JavaScript rendering for dynamic content
- **Extract Images** (optional): Extract and include image references from the page
- **Include Raw HTML** (optional): Include the original HTML alongside the markdown

## Credentials

This node uses API key authentication to connect to the Linkup API.

### Getting Your API Key

1. Create a free account at [https://app.linkup.so](https://app.linkup.so)
2. Navigate to your account settings or API section
3. Generate or copy your API key
4. In n8n, create a new **Linkup API** credential
5. Paste your API key into the credential field

**Note**: When you test your credentials in n8n, the node verifies your API key by checking your account balance. This validation does not consume any credits.

### API Key Security

- Your API key is stored securely by n8n
- The key is transmitted using Bearer token authentication
- Never share your API key or commit it to version control

For more information on obtaining and managing your API key, refer to the [Linkup quickstart guide](https://docs.linkup.so/pages/documentation/get-started/quickstart).

## Compatibility

- **Minimum n8n version**: 1.60.0 or later
- **n8n API version**: 1 (declarative routing)

## Usage Tips

### Credit Management

- Monitor your credit usage with the standard vs. deep search options
- Use **standard** depth for simple queries to save credits
- Reserve **deep** searches for complex questions requiring comprehensive analysis

### Search Output Types

- **Sourced Answer**: Best for getting quick, factual answers with citations
- **Search Results**: Best for gathering multiple sources for further processing
- **Structured**: Best when you need data in a specific format for downstream integrations

### Combining Operations

You can combine Search and Fetch operations in your workflows:
1. Use **Search** to find relevant URLs
2. Use **Fetch** to retrieve full content from those URLs
3. Process the markdown content with other n8n nodes

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Linkup official website](https://www.linkup.so/)
* [Linkup API documentation](https://docs.linkup.so)
* [Linkup quickstart guide](https://docs.linkup.so/pages/documentation/get-started/quickstart)
* [Linkup API reference](https://docs.linkup.so/pages/documentation/api-reference)

## License

[MIT](LICENSE.md)

## Support

For issues with this n8n node, please [open an issue](https://github.com/romainjeff/n8n-nodes-linkup/issues) on GitHub.

For Linkup API support, contact: support@linkup.so
