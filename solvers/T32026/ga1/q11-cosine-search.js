import { makeCosineSearchAnswer } from './generators.js';

export const id = 'q-cosine-similarity-server';
export const title = 'Q11: Cosine Similarity Search';

export async function solve(email) {
  const answerObject = makeCosineSearchAnswer(email);
  const answer = JSON.stringify(answerObject, null, 2);
  return {
    type: 'solved',
    answer,
    variant: '250 documents | 10 queries | 64 dimensions',
    guide: 'The official task generates unit-normalized embeddings from a seeded Gaussian generator. Each query is ranked against all 250 documents by dot product (equivalent to cosine similarity), descending, with ascending doc_id as the tie-break. The complete 10-query JSON answer is provided.',
    answerDisplay: '### Top-5 cosine results\n\nCopy the complete JSON answer from the Answer panel and submit it. It contains ten query keys, each with five document IDs.',
    debug: { documents: 250, queries: 10, embeddingDimensions: 64 },
  };
}
