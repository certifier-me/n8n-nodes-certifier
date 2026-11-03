import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { certifierApiRequest } from '../../shared/transport';

export async function executeGroupOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const name = this.getNodeParameter('name', itemIndex) as string;
	const designIds = this.getNodeParameter('designIds', itemIndex) as string[];
	const { learningEventUrl } = this.getNodeParameter('additionalFields', itemIndex, {}) as {
		learningEventUrl?: string;
	};

	const body: IDataObject = { name, designIds };
	if (learningEventUrl) body.learningEventUrl = learningEventUrl;

	return certifierApiRequest.call(this, 'POST', '/groups', body);
}
