import type { INodeProperties } from 'n8n-workflow';
import { startOperationDescription } from './start';
import { getOperationDescription } from './get';

const showOnlyForResearch = {
	resource: ['research'],
};

export const researchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForResearch,
		},
		options: [
			{
				name: 'Start',
				value: 'start',
				action: 'Start a research task',
				description: 'Start an asynchronous research task. Returns a task ID and initial status — poll Get to retrieve the final result.',
				routing: {
					request: {
						method: 'POST',
						url: '/research',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a research task',
				description: 'Retrieve the current status and result of a research task by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/research/{{$parameter.id}}',
					},
				},
			},
		],
		default: 'start',
	},
	...startOperationDescription,
	...getOperationDescription,
];
