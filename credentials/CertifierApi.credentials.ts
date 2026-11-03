import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CertifierApi implements ICredentialType {
	name = 'certifierApi';

	displayName = 'Certifier API';

	icon: Icon = { light: 'file:../icons/certifier.svg', dark: 'file:../icons/certifier.dark.svg' };

	documentationUrl = 'https://developers.certifier.io/docs/api-reference/quickstart';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Generate an access token in Certifier under Settings → Developers → Access Tokens (https://app.certifier.io/settings/workspace/developers/access-tokens)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				'Certifier-Version': '2022-10-26',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.certifier.io/v1',
			url: '/me',
			method: 'GET',
		},
	};
}
