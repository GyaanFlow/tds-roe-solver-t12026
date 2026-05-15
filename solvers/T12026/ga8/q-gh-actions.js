// Solver: GitHub Actions Secret Hash Chain (Guide)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gh-actions-secret-chain';
export const title = 'GitHub Actions: Secret Hash Chain';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const secret = (await sha256(norm + 'mlops-ga8-q1-salt')).slice(0, 12);
  const marker = (await sha256(`${norm}:ga8-secret-chain-marker`)).slice(0, 8);
  const artifactName = `verify-hash-${marker}`;
  const workflowPath = '.github/workflows/hash-chain.yml';
  const verifyHash = (await sha256(secret + 'github-verified')).slice(0, 10);

  const yamlTemplate = `# .github/workflows/hash-chain.yml
name: Secret Hash Chain

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: marker-${marker}
        run: echo "marker=${marker}"

      - name: Compute hash chain
        env:
          MY_SECRET: \${{ secrets.MY_SECRET }}
        run: |
          VERIFY_HASH=$(echo -n "\${MY_SECRET}github-verified" | sha256sum | cut -c1-10)
          echo "Verify hash: \${VERIFY_HASH}"
          echo "\${VERIFY_HASH}" > verify_hash.txt

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${artifactName}
          path: verify_hash.txt`;

  return {
    type: 'guide',
    variant: `Secret: ${secret} | Marker: ${marker} | Artifact: ${artifactName}`,
    answer: `Steps:
1. Create/use a PUBLIC GitHub repository
2. Go to Settings → Secrets → Actions → add secret MY_SECRET = ${secret}
3. Create workflow file at: ${workflowPath}
4. Paste this YAML:

${yamlTemplate}

5. Push to main → wait for successful run
6. Find the verify hash: ${verifyHash}
7. Submit: https://github.com/OWNER/REPO/actions/runs/RUN_ID|${verifyHash}

Your unique values:
• Secret (MY_SECRET): ${secret}
• Marker: ${marker}
• Artifact name: ${artifactName}
• Verify hash: ${verifyHash}`,
    answerDisplay: `Secret: ${secret}\nVerify Hash: ${verifyHash}\nMarker: ${marker}\nArtifact: ${artifactName}`
  };
}
