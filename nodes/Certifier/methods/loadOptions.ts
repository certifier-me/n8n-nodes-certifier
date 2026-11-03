import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { certifierApiRequest, fetchAllPages } from '../shared/transport';
import type { CertifierAttribute, CertifierDesign } from '../shared/types';

export async function getDesigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const designs = await fetchAllPages<CertifierDesign>(this, '/designs');

	return designs.map((design) => ({
		name: `${design.name} (${design.type === 'badge' ? 'Badge' : 'Certificate'})`,
		value: design.id,
	}));
}

export async function getCustomAttributes(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const attributes: CertifierAttribute[] = await certifierApiRequest.call(
		this,
		'GET',
		'/attributes',
	);

	return attributes
		.filter((attribute) => !attribute.isDefault)
		.map((attribute) => ({ name: attribute.name, value: attribute.tag }));
}
