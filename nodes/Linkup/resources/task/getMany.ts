import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMany = {
	resource: ['task'],
	operation: ['getMany'],
};

export const getManyOperationDescription: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: showOnlyForGetMany,
		},
		routing: {
			request: {
				qs: {
					pageSize: '={{ $value }}',
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
			show: showOnlyForGetMany,
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 1,
				},
				description: 'Page number to return (1-indexed)',
				routing: {
					request: {
						qs: {
							page: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				default: 'createdAt',
				description: 'Field to sort the results by',
				options: [
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
				],
				routing: {
					request: {
						qs: {
							sortBy: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Sort Direction',
				name: 'sortDirection',
				type: 'options',
				default: 'asc',
				description: 'Direction to sort the results in',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
				],
				routing: {
					request: {
						qs: {
							sortDirection: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'completed',
				description: 'Filter tasks by status',
				options: [
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Processing',
						value: 'processing',
					},
				],
				routing: {
					request: {
						qs: {
							status: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'search',
				description: 'Filter tasks by type',
				options: [
					{
						name: 'Fetch',
						value: 'fetch',
					},
					{
						name: 'Research',
						value: 'research',
					},
					{
						name: 'Search',
						value: 'search',
					},
				],
				routing: {
					request: {
						qs: {
							type: '={{ $value }}',
						},
					},
				},
			},
		],
	},
];
