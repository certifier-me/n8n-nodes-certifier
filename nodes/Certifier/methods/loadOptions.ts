import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { certifierApiRequest } from '../shared/transport';
import type { CertifierAttribute } from '../shared/types';

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
