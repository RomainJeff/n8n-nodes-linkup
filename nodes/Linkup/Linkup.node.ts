import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchDescription } from './resources/search';
import { fetchDescription } from './resources/fetch';

export class Linkup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Linkup',
		name: 'linkup',
		icon: { light: 'file:../../icons/linkup.svg', dark: 'file:../../icons/linkup.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Linkup API for web search and content fetching',
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
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Fetch',
						value: 'fetch',
					},
				],
				default: 'search',
			},
			...searchDescription,
			...fetchDescription,
		],
	};
}
