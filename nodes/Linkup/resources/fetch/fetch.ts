import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFetch = {
	resource: ['fetch'],
	operation: ['fetch'],
};

export const fetchOperationDescription: INodeProperties[] = [
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
				displayName: 'Include Raw HTML',
				name: 'includeRawHtml',
				type: 'boolean',
				default: false,
				description: 'Whether to include the raw HTML of the webpage in the response',
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
		],
	},
];
