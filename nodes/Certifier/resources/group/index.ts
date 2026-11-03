import type { INodeProperties } from 'n8n-workflow';

const showForGroup = { resource: ['group'] };
const showForGroupCreate = { resource: ['group'], operation: ['create'] };

export const groupDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForGroup },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a credential template',
				description: 'Create a credential template (group)',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showForGroupCreate },
		description: 'The name of the credential template, used as the [group.name] attribute',
	},
	{
		displayName: 'Design Names or IDs',
		name: 'designIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDesigns' },
		default: [],
		required: true,
		displayOptions: { show: showForGroupCreate },
		description:
			'Certificate and badge designs used by the credential template. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForGroupCreate },
		options: [
			{
				displayName: 'Learning Event URL',
				name: 'learningEventUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/course',
				description: "The learning event's URL shown in the digital wallet",
			},
		],
	},
];
