import type { INodeProperties } from 'n8n-workflow';

const showOnlyForStart = {
	resource: ['research'],
	operation: ['start'],
};

export const startOperationDescription: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'What is the latest news about AI?',
		description: 'The natural language question for which you want to retrieve context. <a href="https://prompt.linkup.so/" target="_blank">Optimize your prompt here</a>.',
		displayOptions: {
			show: showOnlyForStart,
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
		displayName: 'Output Type',
		name: 'outputType',
		type: 'options',
		required: true,
		default: 'sourcedAnswer',
		description: 'Response format for the research results',
		displayOptions: {
			show: showOnlyForStart,
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
		description: 'Pin the research agent mode. Auto lets the agent classify per request.',
		displayOptions: {
			show: showOnlyForStart,
		},
		options: [
			{
				name: 'Answer',
				value: 'Answer',
				description: 'Direct answer for simple questions',
			},
			{
				name: 'Auto',
				value: 'Auto',
				description: 'Agent auto-classifies per request',
			},
			{
				name: 'Investigate',
				value: 'Investigate',
				description: 'Investigative mode for deeper analysis',
			},
			{
				name: 'Research',
				value: 'Research',
				description: 'Full research mode for comprehensive results',
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
		description: 'Pin the reasoning depth. Higher depths trade latency for thoroughness.',
		displayOptions: {
			show: showOnlyForStart,
		},
		options: [
			{
				name: 'S — Small',
				value: 'S',
				description: 'Fastest, least thorough',
			},
			{
				name: 'M — Medium',
				value: 'M',
				description: 'Balanced speed and depth',
			},
			{
				name: 'L — Large',
				value: 'L',
				description: 'Default depth, thorough',
			},
			{
				name: 'XL — Extra Large',
				value: 'XL',
				description: 'Most thorough, highest latency',
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
		description: 'JSON schema defining the structure of the response (required when Output Type is Structured). <a href="https://prompt.linkup.so/" target="_blank">Optimize your schema here</a>.',
		displayOptions: {
			show: {
				...showOnlyForStart,
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
			show: showOnlyForStart,
		},
		options: [
			{
				displayName: 'Exclude Domains',
				name: 'excludeDomains',
				type: 'string',
				default: '',
				placeholder: 'example.com, another.com',
				description: 'Comma-separated list of domains to exclude from research',
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
				description: 'Comma-separated list of domains to restrict research to (max 100)',
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
				description: 'Whether to include images in the research results',
				routing: {
					request: {
						body: {
							includeImages: '={{ $value }}',
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
