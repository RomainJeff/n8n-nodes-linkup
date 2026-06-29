import { describe, it, expect } from 'vitest';
import { extractDescription } from './index';
import { createOperationDescription } from './create';
import { getOperationDescription } from './get';
import { getManyOperationDescription } from './getMany';

describe('Extract Resource', () => {
	const operationProp = extractDescription.find((p) => p.name === 'operation');
	const operations = operationProp?.options as Array<{
		value: string;
		routing: any;
	}>;

	it('should only show for extract resource', () => {
		expect(operationProp?.displayOptions?.show).toEqual({ resource: ['extract'] });
	});

	describe('Operations Routing', () => {
		it('should route create to POST /extract', () => {
			const op = operations?.find((o) => o.value === 'create');
			expect(op?.routing?.request).toEqual({
				method: 'POST',
				url: '/extract',
			});
		});

		it('should route get to GET /extract/:id', () => {
			const op = operations?.find((o) => o.value === 'get');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '=/extract/{{$parameter.id}}',
			});
		});

		it('should route getMany to GET /extract', () => {
			const op = operations?.find((o) => o.value === 'getMany');
			expect(op?.routing?.request).toEqual({
				method: 'GET',
				url: '/extract',
			});
		});
	});

	describe('Create Operation Fields', () => {
		it('should require q field and map to body.q', () => {
			const field = createOperationDescription.find((p) => p.name === 'q');
			expect(field?.required).toBe(true);
			expect(field?.routing?.request?.body).toEqual({ q: '={{ $value }}' });
		});

		it('should require url field and map to body.url', () => {
			const field = createOperationDescription.find((p) => p.name === 'url');
			expect(field?.required).toBe(true);
			expect(field?.routing?.request?.body).toEqual({ url: '={{ $value }}' });
		});

		it('should show q and url only for extract/create', () => {
			const q = createOperationDescription.find((p) => p.name === 'q');
			const url = createOperationDescription.find((p) => p.name === 'url');
			const expected = { resource: ['extract'], operation: ['create'] };
			expect(q?.displayOptions?.show).toEqual(expected);
			expect(url?.displayOptions?.show).toEqual(expected);
		});

		it('should have schema option mapping to body.schema', () => {
			const optionsField = createOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string; routing: any }>;
			const schema = options?.find((o) => o.name === 'schema');
			expect(schema?.routing?.request?.body).toEqual({ schema: '={{ $value }}' });
		});

		it('should have verifyUrls option mapping to body.verifyUrls', () => {
			const optionsField = createOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{
				name: string;
				routing: any;
				default: any;
			}>;
			const verifyUrls = options?.find((o) => o.name === 'verifyUrls');
			expect(verifyUrls?.routing?.request?.body).toEqual({ verifyUrls: '={{ $value }}' });
			expect(verifyUrls?.default).toBe(false);
		});
	});

	describe('Get Operation Fields', () => {
		it('should require id field', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.required).toBe(true);
		});

		it('should show id only for extract/get', () => {
			const field = getOperationDescription.find((p) => p.name === 'id');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['extract'],
				operation: ['get'],
			});
		});
	});

	describe('GetMany Operation Fields', () => {
		it('should map limit to qs.pageSize', () => {
			const field = getManyOperationDescription.find((p) => p.name === 'limit');
			expect(field?.routing?.request?.qs).toEqual({ pageSize: '={{ $value }}' });
		});

		it('should have pagination options', () => {
			const optionsField = getManyOperationDescription.find((p) => p.name === 'options');
			const options = optionsField?.options as Array<{ name: string }>;
			expect(options?.map((o) => o.name)).toEqual(['page', 'sortBy', 'sortDirection']);
		});

		it('should show limit only for extract/getMany', () => {
			const field = getManyOperationDescription.find((p) => p.name === 'limit');
			expect(field?.displayOptions?.show).toEqual({
				resource: ['extract'],
				operation: ['getMany'],
			});
		});
	});
});
