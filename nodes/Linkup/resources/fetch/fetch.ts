import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFetch = {
	resource: ['fetch'],
	operation: ['fetch'],
};

export const fetchOperationDescription: INodeProperties[] = [
	{
		displayName:
			'This node is out of date. Newer versions return raw page content in a rawContent field instead of rawHtml. Please upgrade by removing this node and adding a new one.',
		name: 'outdatedVersionWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForFetch,
				'@version': [{ _cnd: { lte: 1 } }],
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
		description: 'The URL of the webpage you want to fetch',
		displayOptions: {
			show: showOnlyForFetch,
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
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		default: 'standard',
		description:
			'Retrieval approach. Standard is the most cost-effective and works for most pages; Pro has a higher success rate on hard-to-retrieve pages at a higher cost per call.',
		displayOptions: {
			show: showOnlyForFetch,
		},
		options: [
			{
				name: 'Standard',
				value: 'standard',
				description: 'Default retrieval, most cost-effective',
			},
			{
				name: 'Pro',
				value: 'pro',
				description: 'Higher success rate on difficult pages, higher cost',
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
		displayName: 'Extract Structured Data',
		name: 'useSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to extract typed JSON from the page using a JSON schema',
		displayOptions: {
			show: showOnlyForFetch,
		},
	},
	{
		displayName: 'Extraction Schema',
		name: 'schema',
		type: 'json',
		required: true,
		default: '{\n  "type": "object",\n  "properties": {}\n}',
		description:
			'JSON Schema of type "object" describing the JSON to extract. Keep it shallow — primitive fields and single-level arrays are the most reliable. Fields absent from the page are omitted from the response. <a href="https://prompt.linkup.so/" target="_blank">Optimize your schema here</a>.',
		displayOptions: {
			show: {
				...showOnlyForFetch,
				useSchema: [true],
			},
		},
		routing: {
			request: {
				body: {
					schema: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
				},
			},
		},
	},
	{
		displayName: 'Extraction Instructions',
		name: 'instructions',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description:
			'Custom extraction rules the schema cannot express, e.g. how to split rows. Max 4,000 characters.',
		displayOptions: {
			show: {
				...showOnlyForFetch,
				useSchema: [true],
			},
		},
		routing: {
			request: {
				body: {
					instructions: '={{ $value || undefined }}',
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
			show: showOnlyForFetch,
		},
		options: [
			{
				displayName: 'Extract Images',
				name: 'extractImages',
				type: 'boolean',
				default: false,
				description: 'Whether to extract images from the webpage',
				routing: {
					request: {
						body: {
							extractImages: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Include Raw Content',
				name: 'includeRawContent',
				type: 'boolean',
				default: false,
				description:
					'Whether to include the raw page content in the response, alongside a contentType field indicating its format. Useful for complex tables, embedded widgets, or full-content workflows.',
				displayOptions: {
					show: {
						'@version': [{ _cnd: { gte: 1.1 } }],
					},
				},
				routing: {
					request: {
						body: {
							includeRawContent: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Include Raw HTML',
				name: 'includeRawHtml',
				type: 'boolean',
				default: false,
				description:
					'Whether to include the raw HTML of the webpage in the response. Deprecated by the Linkup API — use Include Raw Content instead.',
				displayOptions: {
					show: {
						'@version': [{ _cnd: { lte: 1 } }],
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
				displayName: 'Render JavaScript',
				name: 'renderJs',
				type: 'boolean',
				default: false,
				description: 'Whether to render the JavaScript of the webpage before fetching',
				routing: {
					request: {
						body: {
							renderJs: '={{ $value }}',
						},
					},
				},
			},
		],
	},
];
