import { createHmac, timingSafeEqual } from 'crypto';

const SIGNATURE_PATTERN = /^[0-9a-f]{64}$/i;

export function getIsValidSignature(payload: string, signature: unknown, secret: string) {
	if (typeof signature !== 'string' || !SIGNATURE_PATTERN.test(signature)) return false;

	const expected = createHmac('sha256', secret).update(payload, 'utf8').digest();

	return timingSafeEqual(Buffer.from(signature, 'hex'), expected);
}
