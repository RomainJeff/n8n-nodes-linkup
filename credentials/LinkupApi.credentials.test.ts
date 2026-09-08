import { describe, it, expect } from 'vitest';
import { LinkupApi } from './LinkupApi.credentials';

describe('LinkupApi Credentials', () => {
	const credential = new LinkupApi();

	it('should have correct name and display name', () => {
		expect(credential.name).toBe('linkupApi');
		expect(credential.displayName).toBe('Linkup API');
	});

	it('should define apiKey as password field', () => {
		const apiKeyProp = credential.properties.find((p) => p.name === 'apiKey');
		expect(apiKeyProp).toBeDefined();
		expect(apiKeyProp?.type).toBe('string');
		expect(apiKeyProp?.typeOptions).toEqual({ password: true });
	});

	it('should authenticate via Bearer token in Authorization header', () => {
		expect(credential.authenticate).toEqual({
			type: 'generic',
			properties: {
				headers: {
					Authorization: '=Bearer {{$credentials?.apiKey}}',
				},
			},
		});
	});

	it('should test credentials against GET /credits/balance', () => {
		expect(credential.test).toEqual({
			request: {
				baseURL: 'https://api.linkup.so/v1',
				url: '/credits/balance',
				method: 'GET',
			},
		});
	});
});
