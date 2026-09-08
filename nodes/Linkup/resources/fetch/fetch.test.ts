import { describe, it, expect } from 'vitest';
import { fetchDescription } from './index';
import { fetchOperationDescription } from './fetch';

describe('Fetch Resource', () => {
	const operationProp = fetchDescription.find((p) => p.name === 'operation');
	const fetchOp = (operationProp?.options as Array<{ value: string; routing: any }>)?.find(
		(o) => o.value === 'fetch',
	);

	it('should only show for fetch resource', () => {
		expect(operationProp?.displayOptions?.show).toEqual({ resource: ['fetch'] });
	});

	it('should route fetch to POST /fetch', () => {
		expect(fetchOp?.routing?.request).toEqual({
			method: 'POST',
			url: '/fetch',
		});
	});

	describe('Field Routing', () => {
		it('should map url to body.url', () => {
			const urlField = fetchOperationDescription.find((p) => p.name === 'url');
			expect(urlField?.routing?.request?.body).toEqual({ url: '={{ $value }}' });
			expect(urlField?.required).toBe(true);
		});

		it('should show fields only for fetch resource + operation', () => {
			const urlField = fetchOperationDescription.find((p) => p.name === 'url');
			expect(urlField?.displayOptions?.show).toEqual({
				resource: ['fetch'],
				operation: ['fetch'],
			});
		});
	});

	describe('Options', () => {
		const optionsField = fetchOperationDescription.find((p) => p.name === 'options');
		const options = optionsField?.options as Array<{ name: string; routing: any }>;

		it('should map extractImages to body', () => {
			const field = options?.find((o) => o.name === 'extractImages');
			expect(field?.routing?.request?.body).toEqual({ extractImages: '={{ $value }}' });
		});

		it('should map includeRawHtml to body', () => {
			const field = options?.find((o) => o.name === 'includeRawHtml');
			expect(field?.routing?.request?.body).toEqual({ includeRawHtml: '={{ $value }}' });
		});

		it('should map renderJs to body', () => {
			const field = options?.find((o) => o.name === 'renderJs');
			expect(field?.routing?.request?.body).toEqual({ renderJs: '={{ $value }}' });
		});
	});
});
