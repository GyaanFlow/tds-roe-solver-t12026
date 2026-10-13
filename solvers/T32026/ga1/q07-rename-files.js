import { makeFileReorganization } from './generators.js';

export const id = 'q-rename-files-server';
export const title = 'Q7: Reorganize Files with Shell Commands';

export async function solve(email) {
  const result = await makeFileReorganization(email);
  const categories = [...new Set(result.files.map((file) => file.category))].sort();
  const guide = `### Personalized verification hash\n\n**Submit:** ${result.hash}\n\nThe official expected hash is SHA-256 of the C-locale-sorted destination path list, each path prefixed with ./ and followed by a newline. The generated README is not part of that expected path list.\n\nScenario: ${result.scenario.title}. Files: ${result.files.length}. Categories: ${categories.join(', ')}.\n\nFor a real shell run, use null-delimited find -print0 processing so spaces and Unicode paths stay intact; read the first category: line and flatten each original slash to a dash before moving.`;
  return {
    type: 'solved',
    answer: result.hash,
    variant: `${result.files.length} files | ${result.scenario.name}`,
    guide,
    answerDisplay: `### SHA-256 answer\n\n${result.hash}\n\n${result.files.length} personalized file paths across ${categories.length} categories.`,
    debug: { fileCount: result.files.length, categories, scenario: result.scenario.name },
  };
}
