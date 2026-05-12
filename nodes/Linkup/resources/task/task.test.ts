import { describe, it, expect } from 'vitest';
import { taskDescription } from './index';
import { createOperationDescription } from './create';
import { getOperationDescription } from './get';
import { getManyOperationDescription } from './getMany';

describe('Task Resource', () => {
	const operationProp = taskDescription.find((p) => p.name === 'operation');
	const operations = operationProp?.options as Array<{
		value: string;
		routing: any;
	}>;

	it('should only show for task resource', () => {
		expect(operationProp?.displayOptions?.show).toEqual({ resource: ['task'] });
	});

	describe('Operations Routing', () => {
		it('should route create to POST /tasks', () => {
			const op = operations?.find((o) => o.value === 'create');
			expect(op?.routing?.request).toEqual({
				method: 'POST',
				url: '/tasks',
			});
		});

		it('should route get to GET /tasks/:id', () => {
			const op = operations?.find((o) => o.value === 'get');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '=/tasks/{{$parameter.id}}',
			});
		});

		it('should route getMany to GET /tasks', () => {
			const op = operations?.find((o) => o.value === 'getMany');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '/tasks',
			});
		});
	});

	describe('PreSendAction - wrapBodyInTaskArray', () => {
		const createOp = operations?.find((o: any) => o.value === 'create');
		const preSendFn = createOp?.routing?.send?.preSend?.[0];

		it('should have a preSend hook on create', () => {
			expect(preSendFn).toBeDefined();
			expect(typeof preSendFn).toBe('function');
		});

		it('should wrap search body in task array format', async () => {
			const requestOptions = {
				url: 'https://api.linkup.so/v1/tasks',
				method: 'POST' as const,
				body: {
					type: 'search',
					q: 'test query',
					depth: 'standard',
					outputType: 'sourcedAnswer',
				},
			};

			const result = await preSendFn.call({}, requestOptions);

			expect(result.body).toEqual([
				{
					type: 'search',
					input: {
						q: 'test query',
						depth: 'standard',
						outputType: 'sourcedAnswer',
					},
				},
			]);
		});

		it('should wrap fetch body in task array format', async () => {
			const requestOptions = {
				url: 'https://api.linkup.so/v1/tasks',
				method: 'POST' as const,
				body: {
					type: 'fetch',
					url: 'https://example.com',
				},
			};

			const result = await preSendFn.call({}, requestOptions);

			expect(result.body).toEqual([
				{
					type: 'fetch',
					input: { url: 'https://example.com' },
				},
			]);
		});

		it('should wrap research body in task array format', async () => {
			const requestOptions = {
				url: 'https://api.linkup.so/v1/tasks',
				method: 'POST' as const,
				body: {
					type: 'research',
					q: 'deep topic',
					mode: 'Auto',
					reasoningDepth: 'L',
					outputType: 'sourcedAnswer',
				},
			};

			const result = await preSendFn.call({}, requestOptions);

			expect(result.body).toEqual([
				{
					type: 'research',
					input: {
						q: 'deep topic',
						mode: 'Auto',
						reasoningDepth: 'L',
						outputType: 'sourcedAnswer',
					},
				},
			]);
		});

		it('should remove type from inner input object', async () => {
			const requestOptions = {
				url: 'https://api.linkup.so/v1/tasks',
				method: 'POST' as const,
				body: { type: 'fetch', url: 'https://example.com' },
			};

			const result = await preSendFn.call({}, requestOptions);

			expect((result.body as any[])[0].input).not.toHaveProperty('type');
		});
	});

	describe('Create Operation Fields', () => {
		it('should map type to body.type', () => {
			const field = createOperationDescription.find((p) => p.name === 'type');
			expect(field?.routing?.request?.body).toEqual({ type: '={{ $value }}' });
			expect(field?.required).toBe(true);
		});

		it('should show q only for search and research types', () => {
			const field = createOperationDescription.find((p) => p.name === 'q');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['task'],
				operation: ['create'],
				type: ['search', 'research'],
			});
		});

		it('should show url only for fetch type', () => {
			const field = createOperationDescription.find((p) => p.name === 'url');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['task'],
				operation: ['create'],
				type: ['fetch'],
			});
		});

		it('should show depth only for search type', () => {
			const field = createOperationDescription.find((p) => p.name === 'depth');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['task'],
				operation: ['create'],
				type: ['search'],
			});
		});

		it('should have separate outputType fields for search and research', () => {
			const searchOutput = createOperationDescription.find(
				(p) => p.name === 'outputTypeSearch',
			);
			const researchOutput = createOperationDescription.find(
				(p) => p.name === 'outputTypeResearch',
			);

			expect(searchOutput?.displayOptions?.show?.type).toEqual(['search']);
			expect(researchOutput?.displayOptions?.show?.type).toEqual(['research']);

			expect(searchOutput?.routing?.request?.body).toEqual({
				outputType: '={{ $value }}',
			});
			expect(researchOutput?.routing?.request?.body).toEqual({
				outputType: '={{ $value }}',
			});
		});

		it('should show mode and reasoningDepth only for research type', () => {
			const mode = createOperationDescription.find((p) => p.name === 'mode');
			const depth = createOperationDescription.find((p) => p.name === 'reasoningDepth');

			expect(mode?.displayOptions?.show?.type).toEqual(['research']);
			expect(depth?.displayOptions?.show?.type).toEqual(['research']);
		});

		it('should have separate structured schema fields for search and research', () => {
			const searchSchema = createOperationDescription.find(
				(p) => p.name === 'structuredOutputSchema',
			);
			const researchSchema = createOperationDescription.find(
				(p) => p.name === 'researchStructuredOutputSchema',
			);

			expect(searchSchema?.displayOptions?.show?.outputTypeSearch).toEqual(['structured']);
			expect(researchSchema?.displayOptions?.show?.outputTypeResearch).toEqual([
				'structured',
			]);

			expect(searchSchema?.routing?.request?.body).toEqual({
				structuredOutputSchema: '={{ $value }}',
			});
			expect(researchSchema?.routing?.request?.body).toEqual({
				structuredOutputSchema: '={{ $value }}',
			});
		});
	});

	describe('Create Options - Conditional by Type', () => {
		const optionsField = createOperationDescription.find((p) => p.name === 'options');
		const options = optionsField?.options as Array<{
			name: string;
			displayOptions?: any;
		}>;

		it('should show excludeDomains for search and research', () => {
			const field = options?.find((o) => o.name === 'excludeDomains');
			expect(field?.displayOptions?.show?.['/type']).toEqual(['search', 'research']);
		});

		it('should show extractImages only for fetch', () => {
			const field = options?.find((o) => o.name === 'extractImages');
			expect(field?.displayOptions?.show?.['/type']).toEqual(['fetch']);
		});

		it('should show includeRawHtml only for fetch', () => {
			const field = options?.find((o) => o.name === 'includeRawHtml');
			expect(field?.displayOptions?.show?.['/type']).toEqual(['fetch']);
		});

		it('should show renderJs only for fetch', () => {
			const field = options?.find((o) => o.name === 'renderJs');
			expect(field?.displayOptions?.show?.['/type']).toEqual(['fetch']);
		});

		it('should show includeInlineCitations for search/sourcedAnswer', () => {
			const field = options?.find((o) => o.name === 'includeInlineCitations');
			expect(field?.displayOptions?.show).toEqual({
				'/type': ['search'],
				'/outputTypeSearch': ['sourcedAnswer'],
			});
		});

		it('should show includeSources for search/structured', () => {
			const field = options?.find((o) => o.name === 'includeSources');
			expect(field?.displayOptions?.show).toEqual({
				'/type': ['search'],
				'/outputTypeSearch': ['structured'],
			});
		});
	});

	describe('Get Operation Fields', () => {
		it('should require id field with no routing', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.required).toBe(true);
			expect(field?.routing).toBeUndefined();
		});

		it('should show id only for task/get', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['task'],
				operation: ['get'],
			});
		});
	});

	describe('GetMany Operation Fields', () => {
		it('should map limit to qs.pageSize', () => {
			const field = getManyOperationDescription.find((p) => p.name === 'limit');
			expect(field?.routing?.request?.qs).toEqual({ pageSize: '={{ $value }}' });
		});

		it('should have pagination + filter options', () => {
			const optionsField = getManyOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string }>;
			expect(options?.map((o) => o.name)).toEqual([
				'page',
				'sortBy',
				'sortDirection',
				'status',
				'type',
			]);
		});

		it('should map status to qs.status', () => {
			const optionsField = getManyOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string; routing: any }>;
			const statusField = options?.find((o) => o.name === 'status');
			expect(statusField?.routing?.request?.qs).toEqual({ status: '={{ $value }}' });
		});

		it('should map type to qs.type', () => {
			const optionsField = getManyOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string; routing: any }>;
			const typeField = options?.find((o) => o.name === 'type');
			expect(typeField?.routing?.request?.qs).toEqual({ type: '={{ $value }}' });
		});
	});
});
