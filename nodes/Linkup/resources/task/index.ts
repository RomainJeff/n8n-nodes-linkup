import type { INodeProperties, PreSendAction } from 'n8n-workflow';
import { createOperationDescription } from './create';
import { getOperationDescription } from './get';
import { getManyOperationDescription } from './getMany';

const showOnlyForTask = {
	resource: ['task'],
};

const wrapBodyInTaskArray: PreSendAction = async function (requestOptions) {
	const body = requestOptions.body as Record<string, unknown>;
	const type = body.type as string;
	delete body.type;
	requestOptions.body = [{ type, input: body }];
	return requestOptions;
};

export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTask,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a task',
				description:
					'Create an asynchronous task for search, fetch, or research. Returns a task ID and initial status — poll Get to retrieve the final result.',
				routing: {
					request: {
						method: 'POST',
						url: '/tasks',
					},
					send: {
						preSend: [wrapBodyInTaskArray],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description: 'Retrieve the current status and result of a task by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/tasks/{{$parameter.id}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many tasks',
				description: 'List tasks for the authenticated organization',
				routing: {
					request: {
						method: 'GET',
						url: '/tasks',
					},
				},
			},
		],
		default: 'create',
	},
	...createOperationDescription,
	...getOperationDescription,
	...getManyOperationDescription,
];
