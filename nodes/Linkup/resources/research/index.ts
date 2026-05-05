import type { INodeProperties } from 'n8n-workflow';
import { startOperationDescription } from './start';

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
		],
		default: 'start',
	},
	...startOperationDescription,
];
