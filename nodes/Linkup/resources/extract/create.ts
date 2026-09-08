import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['extract'],
	operation: ['create'],
};

export const createOperationDescription: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Each team member with their name, role, and profile URL',
		description:
			'Natural-language query describing which rows to extract and what fields each row should contain. Name the repeating entity and its fields explicitly.',
		displayOptions: {
			show: showOnlyForCreate,
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
		placeholder: 'https://example.com/team',
		description:
			'Seed URL containing the records to extract. Point to listing pages (directories, catalogs, search results) rather than homepages.',
		displayOptions: {
			show: showOnlyForCreate,
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
				displayName: 'Schema',
				name: 'schema',
				type: 'json',
				default: '{}',
				placeholder:
					'{ "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] }',
				description:
					'JSON Schema defining the structure of each extracted row. Keep schemas flat with primitive types. Omit to let the agent infer structure from your query.',
				routing: {
					request: {
						body: {
							schema:
								'={{ !$value || $value === "{}" ? undefined : typeof $value === "string" ? JSON.parse($value) : $value }}',
						},
					},
				},
			},
			{
				displayName: 'Verify URLs',
				name: 'verifyUrls',
				type: 'boolean',
				default: false,
				description:
					'Whether to check that URLs found in extracted rows are reachable. Adds latency.',
				routing: {
					request: {
						body: {
							verifyUrls: '={{ $value }}',
						},
					},
				},
			},
		],
	},
];
