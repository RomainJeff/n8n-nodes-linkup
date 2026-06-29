import type { INodeProperties } from 'n8n-workflow';
import { createOperationDescription } from './create';
import { getOperationDescription } from './get';
import { getManyOperationDescription } from './getMany';

const showOnlyForExtract = {
	resource: ['extract'],
};

export const extractDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForExtract,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an extract task',
				description:
					'Create an asynchronous extract task that turns a listing page into structured rows. Returns a task ID — poll Get to retrieve the final result.',
				routing: {
					request: {
						method: 'POST',
						url: '/extract',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an extract task',
				description:
					'Retrieve the current status and result of an extract task by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/extract/{{$parameter.id}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many extract tasks',
				description: 'List extract tasks for the authenticated organization',
				routing: {
					request: {
						method: 'GET',
						url: '/extract',
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
