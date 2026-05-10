import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMany = {
	resource: ['research'],
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
		],
	},
];
