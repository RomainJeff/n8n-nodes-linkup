import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSearch = {
	resource: ['search'],
	operation: ['search'],
};

export const searchOperationDescription: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'What is the latest news about AI?',
		description: 'The natural language question for which you want to retrieve context',
		displayOptions: {
			show: showOnlyForSearch,
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
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		required: true,
		default: 'standard',
		description: 'Search precision level. Standard is faster, deep is more comprehensive.',
		displayOptions: {
			show: showOnlyForSearch,
		},
		options: [
			{
				name: 'Standard',
				value: 'standard',
				description: 'Fast search for straightforward queries (1 credit per call)',
			},
			{
				name: 'Deep',
				value: 'deep',
				description: 'Comprehensive search for complex queries (10 credits per call)',
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
		name: 'outputType',
		type: 'options',
		required: true,
		default: 'sourcedAnswer',
		description: 'Response format for the search results',
		displayOptions: {
			show: showOnlyForSearch,
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
		displayName: 'Structured Output Schema',
		name: 'structuredOutputSchema',
		type: 'json',
		required: true,
		default: '{}',
		placeholder: '{ "name": "string", "age": "number" }',
		description: 'JSON schema defining the structure of the response (required when Output Type is Structured)',
		displayOptions: {
			show: {
				...showOnlyForSearch,
				outputType: ['structured'],
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
			show: showOnlyForSearch,
		},
		options: [
			{
				displayName: 'Exclude Domains',
				name: 'excludeDomains',
				type: 'string',
				default: '',
				placeholder: 'example.com, another.com',
				description: 'Comma-separated list of domains to exclude from search',
				routing: {
					request: {
						body: {
							excludeDomains: '={{ $value ? $value.split(",").map(d => d.trim()) : undefined }}',
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
				description: 'Comma-separated list of domains to restrict search to',
				routing: {
					request: {
						body: {
							includeDomains: '={{ $value ? $value.split(",").map(d => d.trim()) : undefined }}',
						},
					},
				},
			},
			{
				displayName: 'Include Images',
				name: 'includeImages',
				type: 'boolean',
				default: false,
				description: 'Whether to include images in the search results',
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
				description: 'Whether to add inline citations in the answer (sourcedAnswer only)',
				displayOptions: {
					show: {
						'/outputType': ['sourcedAnswer'],
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
				displayName: 'Include Sources',
				name: 'includeSources',
				type: 'boolean',
				default: false,
				description: 'Whether to include sources in the response (structured output only)',
				displayOptions: {
					show: {
						'/outputType': ['structured'],
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
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'End date filter (ISO 8601 format)',
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
