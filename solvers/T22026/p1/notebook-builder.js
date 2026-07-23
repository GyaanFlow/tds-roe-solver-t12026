// Shared .ipynb (Jupyter/Colab notebook) builder used by Q3/Q4's "Generate My Colab
// Notebook" buttons. Builds a valid nbformat-4 JSON file client-side from the user's own
// typed values (bucket name, location, aipipe token) and triggers a browser download —
// nothing is ever sent to a server.

function makeCell(type, sourceLines) {
  const source = sourceLines.map((line, i) => (i < sourceLines.length - 1 ? `${line}\n` : line));
  return {
    cell_type: type,
    metadata: {},
    source,
    ...(type === 'code' ? { execution_count: null, outputs: [] } : {})
  };
}

export function buildIpynb(cellsSpec) {
  const notebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: { name: 'python3', display_name: 'Python 3' },
      language_info: { name: 'python' },
      colab: { provenance: [] }
    },
    cells: cellsSpec.map(c => makeCell(c.type, c.source))
  };
  return JSON.stringify(notebook, null, 1);
}

export function downloadIpynb(filename, cellsSpec) {
  const json = buildIpynb(cellsSpec);
  const blob = new Blob([json], { type: 'application/x-ipynb+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Basic client-side sanity checks before a notebook gets generated — same class of
// unfilled-placeholder/typo bugs that broke earlier hand-edited notebooks.
export function validateNotebookInputs({ bucketName, location, aipipeToken }) {
  const errors = [];
  if (!bucketName || !bucketName.trim()) errors.push('Bucket name is required.');
  if (bucketName && /^(YOUR_|PASTE_)/i.test(bucketName.trim())) errors.push('Bucket name still looks like a placeholder — paste your real bucket name from the downloaded task details JSON.');
  if (!location || !location.trim()) errors.push('Location is required (e.g. asia-south1).');
  if (!aipipeToken || !aipipeToken.trim()) errors.push('AIPipe token is required — get one at aipipe.org/login.');
  if (aipipeToken && !aipipeToken.trim().startsWith('eyJ')) errors.push('That AIPipe token does not look like a valid JWT (should start with "eyJ") — copy it again from aipipe.org/login.');
  return errors;
}
