import {
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

import { certifierApiRequest } from '../Certifier/shared/transport';
import type { CertifierWebhook } from '../Certifier/shared/types';
import { getIsValidSignature } from './signature';

type CertifierWebhookEvent = {
	id: string;
	type: string;
	createdAt: string;
	data: {
		credential?: IDataObject;
		credentialInteraction?: IDataObject;
	};
};

const toWebhookName = (workflowName: string | undefined) =>
	`n8n: ${workflowName ?? 'workflow'}`.slice(0, 255);

export class CertifierTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Certifier Trigger',
		name: 'certifierTrigger',
		icon: { light: 'file:../../icons/certifier.svg', dark: 'file:../../icons/certifier.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when credential events happen in Certifier',
		defaults: {
			name: 'Certifier Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'certifierApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'Credential Created',
						value: 'credential.created',
						description: 'A credential was created',
					},
					{
						name: 'Credential Downloaded',
						value: 'credential.downloaded',
						description: 'A recipient downloaded a credential',
					},
					{
						name: 'Credential Expired',
						value: 'credential.expired',
						description: 'A credential reached its expiry date',
					},
					{
						name: 'Credential Issued',
						value: 'credential.issued',
						description: 'A credential was issued',
					},
					{
						name: 'Credential Shared',
						value: 'credential.shared',
						description: 'A recipient shared a credential',
					},
					{
						name: 'Credential Viewed',
						value: 'credential.viewed',
						description: 'A credential was viewed in the digital wallet',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				return typeof webhookData.webhookId === 'string';
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const events = this.getNodeParameter('events') as string[];

				const webhook: CertifierWebhook = await certifierApiRequest.call(
					this,
					'POST',
					'/webhooks',
					{
						name: toWebhookName(this.getWorkflow().name),
						url: this.getNodeWebhookUrl('default'),
						events,
					},
				);

				webhookData.webhookId = webhook.id;
				webhookData.webhookSecret = webhook.secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (typeof webhookData.webhookId !== 'string') return true;

				try {
					await certifierApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`);
				} catch (error) {
					this.logger.warn('Could not delete the Certifier webhook', {
						webhookId: webhookData.webhookId,
						error: error.message,
					});
					return false;
				}

				delete webhookData.webhookId;
				delete webhookData.webhookSecret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const webhookData = this.getWorkflowStaticData('node');
		const request = this.getRequestObject();
		const secret = webhookData.webhookSecret;
		const payload = request.rawBody?.toString('utf8') ?? JSON.stringify(this.getBodyData());
		const signature = this.getHeaderData()['x-webhook-signature'];

		const isValidSignature =
			typeof secret === 'string' && getIsValidSignature(payload, signature, secret);

		if (!isValidSignature) {
			this.getResponseObject().status(401).send('Invalid webhook signature').end();

			return { noWebhookResponse: true };
		}

		const event = this.getBodyData() as CertifierWebhookEvent;
		const { credential, credentialInteraction } = event.data;

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					id: event.id,
					type: event.type,
					createdAt: event.createdAt,
					credential,
					...(credentialInteraction && { credentialInteraction }),
				}),
			],
		};
	}
}
