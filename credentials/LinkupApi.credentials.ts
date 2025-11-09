import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LinkupApi implements ICredentialType {
	name = 'linkupApi';

	displayName = 'Linkup API';

	icon: Icon = { light: 'file:../icons/linkup.svg', dark: 'file:../icons/linkup.dark.svg' };

	documentationUrl = 'https://docs.linkup.so/pages/documentation/get-started/quickstart';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Get your API key from https://app.linkup.so',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.linkup.so/v1',
			url: '/credits/balance',
			method: 'GET',
		},
	};
}
