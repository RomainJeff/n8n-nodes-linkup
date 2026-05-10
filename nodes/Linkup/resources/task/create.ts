import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['task'],
	operation: ['create'],
};

export const createOperationDescription: INodeProperties[] = [
	{
		displayName: 'Task Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'search',
		description: 'The type of task to create',
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{
				name: 'Fetch',
				value: 'fetch',
				description: 'Fetch and extract content from a webpage',
			},
			{
				name: 'Research',
				value: 'research',
				description: 'Run an asynchronous research task',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search the web for information',
			},
		],
		routing: {
			request: {
				body: {
					type: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'What is the latest news about AI?',
		description:
			'The natural language question for which you want to retrieve context. <a href="https://prompt.linkup.so/" target="_blank">Optimize your prompt here</a>.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['search', 'research'],
			},
		},
		routing: {
			request: {
				body: {
					q: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'The webpage URL to fetch and extract content from',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['fetch'],
			},
		},
		routing: {
			request: {
				body: {
					url: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		required: true,
		default: 'standard',
		description:
			'Search precision level. Fast is sub-second, standard balances speed and quality, deep is more comprehensive.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['search'],
			},
		},
		options: [
			{
				name: 'Fast',
				value: 'fast',
				description: 'Sub-second search optimized for simple, focused queries (beta)',
			},
			{
				name: 'Standard',
				value: 'standard',
				description: 'Fast search for straightforward queries',
			},
			{
				name: 'Deep',
				value: 'deep',
				description: 'Comprehensive search for complex queries',
			},
		],
		routing: {
			request: {
				body: {
					depth: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Output Type',
		name: 'outputTypeSearch',
		type: 'options',
		required: true,
		default: 'sourcedAnswer',
		description: 'Response format for the search results',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['search'],
			},
		},
		options: [
			{
				name: 'Sourced Answer',
				value: 'sourcedAnswer',
				description: 'Returns a concise answer with sources',
			},
			{
				name: 'Search Results',
				value: 'searchResults',
				description: 'Returns a list of relevant documents',
			},
			{
				name: 'Structured',
				value: 'structured',
				description: 'Returns structured output according to a user-defined schema',
			},
		],
		routing: {
			request: {
				body: {
					outputType: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Output Type',
		name: 'outputTypeResearch',
		type: 'options',
		required: true,
		default: 'sourcedAnswer',
		description: 'Response format for the research results',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['research'],
			},
		},
		options: [
			{
				name: 'Sourced Answer',
				value: 'sourcedAnswer',
				description: 'Returns a concise answer with sources',
			},
			{
				name: 'Structured',
				value: 'structured',
				description: 'Returns structured output according to a user-defined schema',
			},
		],
		routing: {
			request: {
				body: {
					outputType: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		default: 'Auto',
		description:
			'Research agent mode. Use "Answer" for simple factual questions, "Investigate" for deeper analysis, "Research" for comprehensive multi-source results, or "Auto" to let the agent classify automatically.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['research'],
			},
		},
		options: [
			{
				name: 'Answer',
				value: 'Answer',
				description: 'Quick factual answers to simple, straightforward questions',
			},
			{
				name: 'Auto',
				value: 'Auto',
				description: 'Automatically selects the best mode based on query complexity',
			},
			{
				name: 'Investigate',
				value: 'Investigate',
				description:
					'Deeper analysis for questions requiring cross-referencing or verification',
			},
			{
				name: 'Research',
				value: 'Research',
				description: 'Comprehensive multi-source research for complex or broad topics',
			},
		],
		routing: {
			request: {
				body: {
					mode: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Reasoning Depth',
		name: 'reasoningDepth',
		type: 'options',
		default: 'L',
		description:
			'Controls thoroughness vs speed. Use "S" for quick lookups, "M" for balanced queries, "L" for thorough research (default), "XL" for maximum depth on complex topics.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				type: ['research'],
			},
		},
		options: [
			{
				name: 'S — Small',
				value: 'S',
				description: 'Fastest response, suitable for simple factual lookups',
			},
			{
				name: 'M — Medium',
				value: 'M',
				description: 'Balanced speed and depth for moderate questions',
			},
			{
				name: 'L — Large',
				value: 'L',
				description: 'Thorough research, good default for most queries',
			},
			{
				name: 'XL — Extra Large',
				value: 'XL',
				description: 'Maximum depth for complex topics requiring extensive analysis',
			},
		],
		routing: {
			request: {
				body: {
					reasoningDepth: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Structured Output Schema',
		name: 'structuredOutputSchema',
		type: 'json',
		required: true,
		default: '{}',
		placeholder: '{ "name": "string", "age": "number" }',
		description:
			'JSON schema defining the structure of the response (required when Output Type is Structured). <a href="https://prompt.linkup.so/" target="_blank">Optimize your schema here</a>.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				outputTypeSearch: ['structured'],
			},
		},
		routing: {
			request: {
				body: {
					structuredOutputSchema: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Structured Output Schema',
		name: 'researchStructuredOutputSchema',
		type: 'json',
		required: true,
		default: '{}',
		placeholder: '{ "name": "string", "age": "number" }',
		description:
			'JSON schema defining the structure of the response (required when Output Type is Structured). <a href="https://prompt.linkup.so/" target="_blank">Optimize your schema here</a>.',
		displayOptions: {
			show: {
				...showOnlyForCreate,
				outputTypeResearch: ['structured'],
			},
		},
		routing: {
			request: {
				body: {
					structuredOutputSchema: '={{ $value }}',
				},
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForCreate,
		},
		options: [
			{
				displayName: 'Exclude Domains',
				name: 'excludeDomains',
				type: 'string',
				default: '',
				placeholder: 'example.com, another.com',
				description: 'Comma-separated list of domains to exclude',
				displayOptions: {
					show: {
						'/type': ['search', 'research'],
					},
				},
				routing: {
					request: {
						body: {
							excludeDomains:
								'={{ $value ? $value.split(",").map(d => d.trim()) : undefined }}',
						},
					},
				},
			},
			{
				displayName: 'Extract Images',
				name: 'extractImages',
				type: 'boolean',
				default: false,
				description: 'Whether to extract images from the fetched page',
				displayOptions: {
					show: {
						'/type': ['fetch'],
					},
				},
				routing: {
					request: {
						body: {
							extractImages: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Start date filter (ISO 8601 format)',
				displayOptions: {
					show: {
						'/type': ['search', 'research'],
					},
				},
				routing: {
					request: {
						body: {
							fromDate: '={{ $value ? $value.split("T")[0] : undefined }}',
						},
					},
				},
			},
			{
				displayName: 'Include Domains',
				name: 'includeDomains',
				type: 'string',
				default: '',
				placeholder: 'example.com, another.com',
				description: 'Comma-separated list of domains to restrict to (max 100)',
				displayOptions: {
					show: {
						'/type': ['search', 'research'],
					},
				},
				routing: {
					request: {
						body: {
							includeDomains:
								'={{ $value ? $value.split(",").map(d => d.trim()) : undefined }}',
						},
					},
				},
			},
			{
				displayName: 'Include Images',
				name: 'includeImages',
				type: 'boolean',
				default: false,
				description: 'Whether to include images in the results',
				displayOptions: {
					show: {
						'/type': ['search', 'research'],
					},
				},
				routing: {
					request: {
						body: {
							includeImages: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Include Inline Citations',
				name: 'includeInlineCitations',
				type: 'boolean',
				default: false,
				description:
					'Whether to add inline citations in the answer (search with sourcedAnswer only)',
				displayOptions: {
					show: {
						'/type': ['search'],
						'/outputTypeSearch': ['sourcedAnswer'],
					},
				},
				routing: {
					request: {
						body: {
							includeInlineCitations: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Include Raw HTML',
				name: 'includeRawHtml',
				type: 'boolean',
				default: false,
				description: 'Whether to include raw HTML in the fetch response',
				displayOptions: {
					show: {
						'/type': ['fetch'],
					},
				},
				routing: {
					request: {
						body: {
							includeRawHtml: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Include Sources',
				name: 'includeSources',
				type: 'boolean',
				default: false,
				description:
					'Whether to include sources in the response (search with structured output only)',
				displayOptions: {
					show: {
						'/type': ['search'],
						'/outputTypeSearch': ['structured'],
					},
				},
				routing: {
					request: {
						body: {
							includeSources: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				default: '',
				placeholder: '10',
				description: 'Maximum number of search results to return (search only)',
				displayOptions: {
					show: {
						'/type': ['search'],
					},
				},
				routing: {
					request: {
						body: {
							maxResults: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Render JavaScript',
				name: 'renderJs',
				type: 'boolean',
				default: false,
				description: 'Whether to render JavaScript before fetching the page content',
				displayOptions: {
					show: {
						'/type': ['fetch'],
					},
				},
				routing: {
					request: {
						body: {
							renderJs: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'End date filter (ISO 8601 format)',
				displayOptions: {
					show: {
						'/type': ['search', 'research'],
					},
				},
				routing: {
					request: {
						body: {
							toDate: '={{ $value ? $value.split("T")[0] : undefined }}',
						},
					},
				},
			},
		],
	},
];
