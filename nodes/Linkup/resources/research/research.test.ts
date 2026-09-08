import { describe, it, expect } from 'vitest';
import { researchDescription } from './index';
import { startOperationDescription } from './start';
import { getOperationDescription } from './get';
import { getManyOperationDescription } from './getMany';

describe('Research Resource', () => {
	const operationProp = researchDescription.find((p) => p.name === 'operation');
	const operations = operationProp?.options as Array<{
		value: string;
		routing: any;
	}>;

	it('should only show for research resource', () => {
		expect(operationProp?.displayOptions?.show).toEqual({ resource: ['research'] });
	});

	describe('Operations Routing', () => {
		it('should route start to POST /research', () => {
			const op = operations?.find((o) => o.value === 'start');
			expect(op?.routing?.request).toEqual({
				method: 'POST',
				url: '/research',
			});
		});

		it('should route get to GET /research/:id', () => {
			const op = operations?.find((o) => o.value === 'get');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '=/research/{{$parameter.id}}',
			});
		});

		it('should route getMany to GET /research', () => {
			const op = operations?.find((o) => o.value === 'getMany');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '/research',
			});
		});
	});

	describe('Start Operation Fields', () => {
		it('should map q to body.q', () => {
			const field = startOperationDescription.find((p) => p.name === 'q');
			expect(field?.routing?.request?.body).toEqual({ q: '={{ $value }}' });
			expect(field?.required).toBe(true);
		});

		it('should map outputType to body.outputType', () => {
			const field = startOperationDescription.find((p) => p.name === 'outputType');
			expect(field?.routing?.request?.body).toEqual({ outputType: '={{ $value }}' });
		});

		it('should map mode to body.mode', () => {
			const field = startOperationDescription.find((p) => p.name === 'mode');
			expect(field?.routing?.request?.body).toEqual({ mode: '={{ $value }}' });
		});

		it('should map reasoningDepth to body.reasoningDepth', () => {
			const field = startOperationDescription.find((p) => p.name === 'reasoningDepth');
			expect(field?.routing?.request?.body).toEqual({ reasoningDepth: '={{ $value }}' });
		});

		it('should show structuredOutputSchema only when outputType is structured', () => {
			const field = startOperationDescription.find(
				(p) => p.name === 'structuredOutputSchema',
			);
			expect(field?.displayOptions?.show).toEqual({
				resource: ['research'],
				operation: ['start'],
				outputType: ['structured'],
			});
		});

		it('should have options collection with 5 fields', () => {
			const optionsField = startOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string }>;
			expect(options?.map((o) => o.name)).toEqual([
				'excludeDomains',
				'fromDate',
				'includeDomains',
				'includeImages',
				'toDate',
			]);
		});
	});

	describe('Get Operation Fields', () => {
		it('should require id field with no routing', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.required).toBe(true);
			expect(field?.routing).toBeUndefined();
		});

		it('should show id only for research/get', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['research'],
				operation: ['get'],
			});
		});
	});

	describe('GetMany Operation Fields', () => {
		it('should map limit to qs.pageSize', () => {
			const field = getManyOperationDescription.find((p) => p.name === 'limit');
			expect(field?.routing?.request?.qs).toEqual({ pageSize: '={{ $value }}' });
		});

		it('should have pagination options (page, sortBy, sortDirection)', () => {
			const optionsField = getManyOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string }>;
			expect(options?.map((o) => o.name)).toEqual(['page', 'sortBy', 'sortDirection']);
		});
	});
});
