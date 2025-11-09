import type { INodeProperties } from 'n8n-workflow';
import { fetchOperationDescription } from './fetch';

const showOnlyForFetch = {
	resource: ['fetch'],
};

export const fetchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForFetch,
		},
		options: [
			{
				name: 'Fetch',
				value: 'fetch',
				action: 'Fetch webpage content',
				description: 'Fetch and convert a webpage to markdown',
				routing: {
					request: {
						method: 'POST',
						url: '/fetch',
					},
				},
			},
		],
		default: 'fetch',
	},
	...fetchOperationDescription,
];
