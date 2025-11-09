import type {
	IHookFunctions,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function linkupApiRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
) {
	const options: IHttpRequestOptions = {
		method: method,
		qs,
		body,
		url: `https://api.linkup.so/v1${resource}`,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'linkupApi', options);
}
