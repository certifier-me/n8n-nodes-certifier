import {
	NodeApiError,
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';

import { searchGroups } from './methods/listSearch';
import { getCustomAttributes, getDesigns } from './methods/loadOptions';
import { credentialDescription } from './resources/credential';
import { executeCredentialOperation } from './resources/credential/execute';
import { groupDescription } from './resources/group';
import { executeGroupOperation } from './resources/group/execute';

export class Certifier implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Certifier',
		name: 'certifier',
		icon: { light: 'file:../../icons/certifier.svg', dark: 'file:../../icons/certifier.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create, issue and send digital certificates and badges with Certifier',
		defaults: {
			name: 'Certifier',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'certifierApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Credential',
						value: 'credential',
					},
					{
						name: 'Credential Template',
						value: 'group',
					},
				],
				default: 'credential',
			},
			...credentialDescription,
			...groupDescription,
		],
	};

	methods = {
		loadOptions: {
			getCustomAttributes,
			getDesigns,
		},
		listSearch: {
			searchGroups,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const responseData =
					resource === 'group'
						? await executeGroupOperation.call(this, itemIndex)
						: await executeCredentialOperation.call(this, operation, itemIndex);

				returnData.push(
					...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), {
						itemData: { item: itemIndex },
					}),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
					continue;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
