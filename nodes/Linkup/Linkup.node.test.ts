import { describe, it, expect } from 'vitest';
import { NodeConnectionTypes } from 'n8n-workflow';
import { Linkup } from './Linkup.node';

describe('Linkup Node', () => {
	const node = new Linkup();
	const { description } = node;

	it('should have correct metadata', () => {
		expect(description.displayName).toBe('Linkup');
		expect(description.name).toBe('linkup');
		expect(description.version).toBe(1);
		expect(description.usableAsTool).toBe(true);
	});

	it('should require linkupApi credentials', () => {
		expect(description.credentials).toEqual([{ name: 'linkupApi', required: true }]);
	});

	it('should set correct request defaults', () => {
		expect(description.requestDefaults).toEqual({
			baseURL: 'https://api.linkup.so/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
	});

	it('should define all four resources', () => {
		const resourceProp = description.properties.find((p) => p.name === 'resource');
		const values = (resourceProp?.options as Array<{ value: string }>)?.map((o) => o.value);
		expect(values).toEqual(['fetch', 'research', 'search', 'task']);
	});

	it('should default resource to search', () => {
		const resourceProp = description.properties.find((p) => p.name === 'resource');
		expect(resourceProp?.default).toBe('search');
	});

	it('should use Main connection type for inputs and outputs', () => {
		expect(description.inputs).toEqual([NodeConnectionTypes.Main]);
		expect(description.outputs).toEqual([NodeConnectionTypes.Main]);
	});
});
