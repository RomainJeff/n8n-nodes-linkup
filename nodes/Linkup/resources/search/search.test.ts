import { describe, it, expect } from 'vitest';
import { searchDescription } from './index';
import { searchOperationDescription } from './search';

describe('Search Resource', () => {
	const operationProp = searchDescription.find((p) => p.name === 'operation');
	const searchOp = (operationProp?.options as Array<{ value: string; routing: any }>)?.find(
		(o) => o.value === 'search',
	);

	it('should only show for search resource', () => {
		expect(operationProp?.displayOptions?.show).toEqual({ resource: ['search'] });
	});

	it('should route search to POST /search', () => {
		expect(searchOp?.routing?.request).toEqual({
			method: 'POST',
			url: '/search',
		});
	});

	describe('Field Routing', () => {
		it('should map q to body.q', () => {
			const field = searchOperationDescription.find((p) => p.name === 'q');
			expect(field?.routing?.request?.body).toEqual({ q: '={{ $value }}' });
			expect(field?.required).toBe(true);
		});

		it('should map depth to body.depth', () => {
			const field = searchOperationDescription.find((p) => p.name === 'depth');
			expect(field?.routing?.request?.body).toEqual({ depth: '={{ $value }}' });
		});

		it('should map outputType to body.outputType', () => {
			const field = searchOperationDescription.find((p) => p.name === 'outputType');
			expect(field?.routing?.request?.body).toEqual({ outputType: '={{ $value }}' });
		});

		it('should map structuredOutputSchema to body', () => {
			const field = searchOperationDescription.find(
				(p) => p.name === 'structuredOutputSchema',
			);
			expect(field?.routing?.request?.body).toEqual({
				structuredOutputSchema: '={{ $value }}',
			});
			expect(field?.required).toBe(true);
		});
	});

	describe('DisplayOptions', () => {
		it('should show structuredOutputSchema only when outputType is structured', () => {
			const field = searchOperationDescription.find(
				(p) => p.name === 'structuredOutputSchema',
			);
			expect(field?.displayOptions?.show).toEqual({
				resource: ['search'],
				operation: ['search'],
				outputType: ['structured'],
			});
		});

		it('should show includeInlineCitations only for sourcedAnswer', () => {
			const optionsField = searchOperationDescription.find((p) => p.name === 'options');
			const innerOptions = optionsField?.options as Array<{
				name: string;
				displayOptions?: any;
			}>;
			const field = innerOptions?.find((o) => o.name === 'includeInlineCitations');
			expect(field?.displayOptions?.show).toEqual({
				'/outputType': ['sourcedAnswer'],
			});
		});

		it('should show includeSources only for structured output', () => {
			const optionsField = searchOperationDescription.find((p) => p.name === 'options');
			const innerOptions = optionsField?.options as Array<{
				name: string;
				displayOptions?: any;
			}>;
			const field = innerOptions?.find((o) => o.name === 'includeSources');
			expect(field?.displayOptions?.show).toEqual({
				'/outputType': ['structured'],
			});
		});
	});

	describe('Options', () => {
		const optionsField = searchOperationDescription.find((p) => p.name === 'options');
		const options = optionsField?.options as Array<{ name: string; routing: any }>;

		it('should have all expected option fields', () => {
			const names = options?.map((o) => o.name);
			expect(names).toEqual([
				'excludeDomains',
				'fromDate',
				'includeDomains',
				'includeImages',
				'includeInlineCitations',
				'includeSources',
				'maxResults',
				'toDate',
			]);
		});
	});
});
