import type { INodeProperties } from 'n8n-workflow';

import { credentialIdField, groupLocator } from '../../shared/descriptions';

const showForCredential = { resource: ['credential'] };
const showForCreate = { resource: ['credential'], operation: ['createAndIssue', 'create'] };
const showForCreateAndIssue = { resource: ['credential'], operation: ['createAndIssue'] };
const showForExisting = { resource: ['credential'], operation: ['issue', 'send'] };

export const credentialDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForCredential },
		options: [
			{
				name: 'Create and Issue',
				value: 'createAndIssue',
				action: 'Create and issue a credential',
				description: 'Create a credential, issue it and optionally email it to the recipient',
			},
			{
				name: 'Create Draft',
				value: 'create',
				action: 'Create a draft credential',
				description: 'Create a credential without issuing it',
			},
			{
				name: 'Issue',
				value: 'issue',
				action: 'Issue a draft credential',
				description: 'Issue an existing draft credential',
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send a credential',
				description: 'Email an issued credential to its recipient',
			},
		],
		default: 'createAndIssue',
	},
	{
		...groupLocator,
		displayOptions: { show: showForCreate },
	},
	{
		displayName: 'Recipient Name',
		name: 'recipientName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showForCreate },
		description: 'The name of the credential recipient',
	},
	{
		displayName: 'Recipient Email',
		name: 'recipientEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: showForCreate },
		description: 'The email of the credential recipient',
	},
	{
		displayName: 'Send to Recipient',
		name: 'sendToRecipient',
		type: 'boolean',
		default: true,
		displayOptions: { show: showForCreateAndIssue },
		description:
			'Whether to email the credential to the recipient after issuing it, using the email template of the credential template',
	},
	{
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'fixedCollection',
		placeholder: 'Add Custom Attribute',
		default: {},
		typeOptions: { multipleValues: true },
		displayOptions: { show: showForCreate },
		options: [
			{
				displayName: 'Attribute',
				name: 'attribute',
				values: [
					{
						displayName: 'Attribute Name or ID',
						name: 'tag',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getCustomAttributes' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForCreate },
		options: [
			{
				displayName: 'Expiry Date',
				name: 'expiryDate',
				type: 'dateTime',
				default: '',
				description:
					"The credential's expiry date. Leave empty to use the credential template's expiration period.",
			},
			{
				displayName: 'Issue Date',
				name: 'issueDate',
				type: 'dateTime',
				default: '',
				description: "The credential's issue date. Leave empty to use the date it is issued.",
			},
		],
	},
	{
		...credentialIdField,
		displayOptions: { show: showForExisting },
	},
];
