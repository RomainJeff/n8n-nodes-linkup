import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchDescription } from './resources/search';
import { fetchDescription } from './resources/fetch';
import { researchDescription } from './resources/research';
import { taskDescription } from './resources/task';

export class Linkup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Linkup',
		name: 'linkup',
		icon: { light: 'file:../../icons/linkup.svg', dark: 'file:../../icons/linkup.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Linkup API for web search, content fetching, research and async task operations',
		defaults: {
			name: 'Linkup',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'linkupApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.linkup.so/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
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
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'search',
			},
			...searchDescription,
			...fetchDescription,
			...researchDescription,
			...taskDescription,
		],
	};
}
