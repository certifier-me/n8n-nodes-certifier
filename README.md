# n8n-nodes-certifier

This is an n8n community node for [Certifier](https://certifier.io). It lets you create, issue and send digital certificates and badges from your n8n workflows, and start workflows when something happens to a credential.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Trigger events](#trigger-events)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation and install `n8n-nodes-certifier`.

## Operations

**Credential**

- **Create and Issue**: create a credential from a credential template and issue it. With **Send to Recipient** on (the default), Certifier also emails it to the recipient.
- **Create Draft**: create a credential without issuing it.
- **Issue**: issue an existing draft credential.
- **Send**: email an issued credential to its recipient.

Create and Issue and Create Draft accept the recipient's name and email, custom attributes defined in your workspace, and optional issue and expiry dates.

**Credential Template**

- **Create**: create a credential template (group) from one or more certificate or badge designs.

## Trigger events

The **Certifier Trigger** node registers a webhook in your Certifier workspace when the workflow is activated and removes it when the workflow is deactivated. Every request is checked against the webhook's signature before the workflow runs.

- Credential Created
- Credential Issued
- Credential Viewed
- Credential Downloaded
- Credential Shared
- Credential Expired

Each event contains the event `id`, `type` and `createdAt`, the `credential`, and for viewed, downloaded and shared events the `credentialInteraction`.

## Credentials

The node authenticates with a Certifier access token.

1. In Certifier, go to [Settings → Developers → Access Tokens](https://app.certifier.io/settings/workspace/developers/access-tokens).
2. Generate an access token.
3. In n8n, create a **Certifier API** credential and paste the token into **Access Token**.

The token acts on behalf of your workspace, so keep it private.

## Compatibility

Built and tested with n8n-workflow 2.x (n8n 2.x).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Certifier API reference](https://developers.certifier.io/docs/api-reference/quickstart)
- [Certifier webhooks](https://developers.certifier.io/docs/api-reference/webhooks)
