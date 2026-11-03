import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

import { fetchPage } from '../shared/transport';
import type { CertifierGroup } from '../shared/types';

export async function searchGroups(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = await fetchPage<CertifierGroup>(this, '/groups', paginationToken);

	const query = filter?.trim().toLowerCase();
	const groups = query
		? page.items.filter((group) => group.name.toLowerCase().includes(query))
		: page.items;

	return {
		results: groups.map((group) => ({ name: group.name, value: group.id })),
		paginationToken: page.next,
	};
}
