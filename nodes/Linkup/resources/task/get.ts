import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['task'],
	operation: ['get'],
};

export const getOperationDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. b3f1c2d4-...',
		description: 'The identifier of the task to retrieve',
		displayOptions: {
			show: showOnlyForGet,
		},
	},
];
