import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { certifierApiRequest } from '../../shared/transport';
import type { CertifierCredential } from '../../shared/types';

type CustomAttributeEntry = { tag: string; value: string };

type DateFields = { issueDate?: string; expiryDate?: string };

const toApiDate = (value: string) => value.slice(0, 10);

function toCreateCredentialBody(this: IExecuteFunctions, itemIndex: number): IDataObject {
	const groupId = this.getNodeParameter('groupId', itemIndex, '', { extractValue: true }) as string;
	const recipientName = this.getNodeParameter('recipientName', itemIndex) as string;
	const recipientEmail = this.getNodeParameter('recipientEmail', itemIndex) as string;
	const customAttributes = this.getNodeParameter(
		'customAttributes.attribute',
		itemIndex,
		[],
	) as CustomAttributeEntry[];
	const { issueDate, expiryDate } = this.getNodeParameter(
		'additionalFields',
		itemIndex,
		{},
	) as DateFields;

	const body: IDataObject = {
		groupId,
		recipient: { name: recipientName, email: recipientEmail },
		customAttributes: Object.fromEntries(
			customAttributes
				.filter((attribute) => attribute.tag)
				.map((attribute) => [attribute.tag, attribute.value]),
		),
	};

	if (issueDate) body.issueDate = toApiDate(issueDate);
	if (expiryDate) body.expiryDate = toApiDate(expiryDate);

	return body;
}

async function createAndIssue(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const body = toCreateCredentialBody.call(this, itemIndex);
	const sendToRecipient = this.getNodeParameter('sendToRecipient', itemIndex, true) as boolean;

	if (sendToRecipient) {
		return certifierApiRequest.call(this, 'POST', '/credentials/create-issue-send', body);
	}

	const draft: CertifierCredential = await certifierApiRequest.call(
		this,
		'POST',
		'/credentials',
		body,
	);

	return certifierApiRequest.call(this, 'POST', `/credentials/${draft.id}/issue`);
}

export async function executeCredentialOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject> {
	if (operation === 'createAndIssue') {
		return createAndIssue.call(this, itemIndex);
	}

	if (operation === 'create') {
		return certifierApiRequest.call(
			this,
			'POST',
			'/credentials',
			toCreateCredentialBody.call(this, itemIndex),
		);
	}

	const credentialId = encodeURIComponent(
		this.getNodeParameter('credentialId', itemIndex) as string,
	);

	if (operation === 'issue') {
		return certifierApiRequest.call(this, 'POST', `/credentials/${credentialId}/issue`);
	}

	return certifierApiRequest.call(this, 'POST', `/credentials/${credentialId}/send`, {
		deliveryMethod: 'email',
	});
}
