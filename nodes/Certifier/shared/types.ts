export type CertifierGroup = {
	id: string;
	name: string;
};

export type CertifierDesign = {
	id: string;
	name: string;
	type: 'certificate' | 'badge';
};

export type CertifierAttribute = {
	id: string;
	name: string;
	tag: string;
	isDefault: boolean;
};

export type CertifierCredential = {
	id: string;
	status: string;
};

export type CertifierWebhook = {
	id: string;
	secret: string;
};
