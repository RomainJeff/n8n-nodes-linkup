import type { INodeProperties } from 'n8n-workflow';
import { searchOperationDescription } from './search';

const showOnlyForSearch = {
	resource: ['search'],
};

export const searchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSearch,
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Perform a web search',
				description: 'Search the web and retrieve context for AI grounding',
				routing: {
					request: {
						method: 'POST',
						url: '/search',
					},
				},
			},
		],
		default: 'search',
	},
	...searchOperationDescription,
];
