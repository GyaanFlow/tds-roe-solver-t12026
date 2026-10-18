import { apiAnswer, ga2Url } from './api-client.js';
import { rng } from './utils.js';

export const id = 'q-oauth-jwks-verify-server';
export const title = 'Q4: OAuth 2.0 / OIDC Token Verification Service';

export function computeOAuthSeeds(email) {
  const norm = (email || '').trim().toLowerCase();
  const r = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const random = rng(`q-oauth-jwks-verify-server#${norm}#`);
  const n = (len) => Array.from({ length: len }, () => r[Math.floor(random() * r.length)]).join('');
  return {
    iss: 'https://idp.exam.local',
    aud: `tds-${n(8)}.apps.exam.local`,
    sub: `sub-${n(12)}`
  };
}

export async function solve(email) {
  const url = ga2Url(email, '/q2/verify');
  const seeds = computeOAuthSeeds(email);

  return apiAnswer({
    title,
    url,
    variant: `OIDC RS256 Verification API (aud: ${seeds.aud})`,
    notes: `Your assigned OIDC claims are:\n- **Issuer (iss):** \`${seeds.iss}\`\n- **Audience (aud):** \`${seeds.aud}\`\n- **Subject (sub):** \`${seeds.sub}\`\n\nThe backend validates RS256 signatures using the official IdP public key, verifies claims, checks future expiration (\`exp > now\`), and correctly rejects expired, wrong-audience, and tampered tokens with HTTP 401.`,
    debug: { question: 'Q4', route: '/q2/verify', seeds }
  });
}
