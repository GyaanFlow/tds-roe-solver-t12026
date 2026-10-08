import { makeGuideResult } from './utils.js';

export const id = 'q-config-precedence-server';
export const title = 'Q6: Resolve 12-Factor Config Precedence';

export async function solve() {
  return {
    ...makeGuideResult(
      'API implementation intentionally deferred to the separate T3 API project.',
      '### API project handoff\n\nThis question asks you to deploy a FastAPI service that merges defaults, YAML, `.env`, OS environment variables, and fresh CLI query overrides, then exposes an `/effective-config` endpoint. Per your project split, API implementation is deferred.\n\nWhen integrating the separate API project, preserve precedence in this exact order: defaults → environment YAML → `.env` → `APP_*` OS variables → repeated `?set=key=value` CLI overrides. Convert `NUM_WORKERS` to `workers`, preserve booleans and numeric types, and return only the five requested effective keys.',
      'API handoff | implementation pending',
    ),
    debug: { integrationStatus: 'pending-separate-api-project' },
  };
}
