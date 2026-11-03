import type { INodeProperties } from 'n8n-workflow';

export const groupLocator: INodeProperties = {
	displayName: 'Credential Template',
	name: 'groupId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The credential template (group) the credential is issued from',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a credential template...',
			typeOptions: {
				searchListMethod: 'searchGroups',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 01g90279gp5sbmfek7wymcsvec',
		},
	],
};

export const credentialIdField: INodeProperties = {
	displayName: 'Credential ID',
	name: 'credentialId',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. 01hz2f0c9ryvzajg20jqh9taab',
	description: 'The ID of the credential, for example from a previous Certifier step',
};
