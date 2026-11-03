import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export const CERTIFIER_API_URL = 'https://api.certifier.io/v1';

type CertifierRequestContext = IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions;

type CertifierPage<T> = {
	data: T[];
	pagination?: { next: string | null };
};

const toPageQuery = (cursor?: string): IDataObject =>
	cursor ? { limit: 100, cursor } : { limit: 100 };

export async function certifierApiRequest(
	this: CertifierRequestContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
) {
	const options: IHttpRequestOptions = {
		method,
		url: `${CERTIFIER_API_URL}${endpoint}`,
		json: true,
	};

	if (body !== undefined) options.body = body;
	if (qs !== undefined) options.qs = qs;

	return this.helpers.httpRequestWithAuthentication.call(this, 'certifierApi', options);
}

export async function fetchPage<T>(
	context: CertifierRequestContext,
	endpoint: string,
	cursor?: string,
): Promise<{ items: T[]; next?: string }> {
	const page: CertifierPage<T> = await certifierApiRequest.call(
		context,
		'GET',
		endpoint,
		undefined,
		toPageQuery(cursor),
	);

	return { items: page.data, next: page.pagination?.next ?? undefined };
}

export async function fetchAllPages<T>(
	context: CertifierRequestContext,
	endpoint: string,
): Promise<T[]> {
	const items: T[] = [];
	let cursor: string | undefined;

	do {
		const page = await fetchPage<T>(context, endpoint, cursor);
		items.push(...page.items);
		cursor = page.next;
	} while (cursor);

	return items;
}
