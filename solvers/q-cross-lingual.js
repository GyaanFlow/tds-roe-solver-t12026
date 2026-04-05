// Bypass: Cross-Lingual Entity Disambiguation (LLM-based, weight=1)
export const id = 'q-cross-lingual-entity-disambiguation-server';
export const title = 'Cross-Lingual Entity Disambiguation';

export function solve(email) {
  return {
    variant: 'LLM-based — requires processing 1000 documents',
    type: 'bypass',
    answer: `// 🔥 GUIDE: Cross-Lingual Entity Disambiguation (1 mark)
//
// AUTOMATED PIPELINE (Python + OpenAI/Gemini):
// =============================================
// import json, csv, os
// from openai import OpenAI  # or google.generativeai
//
// client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
//
// # Load data
// docs = [json.loads(line) for line in open("documents.jsonl")]
// entities = list(csv.DictReader(open("entity_reference.csv")))
//
// # Build entity lookup string
// entity_info = "\\n".join([
//     f"{e['entity_id']}: {e['canonical_name']} ({e.get('era','')}, {e.get('region','')})"
//     for e in entities
// ])
//
// results = []
// for doc in docs:
//     prompt = f"""Match this historical document to the correct entity.
//
// Document text: {doc['text'][:500]}
// Language: {doc['language']}
// Year mentioned: {doc.get('year', 'unknown')}
// Name mentioned: {doc['mentioned_name']}
//
// Entities:
// {entity_info}
//
// Reply with ONLY the entity_id (e.g., E001). Nothing else."""
//
//     resp = client.chat.completions.create(
//         model="gpt-4o-mini",
//         messages=[{"role": "user", "content": prompt}],
//         max_tokens=10
//     )
//     eid = resp.choices[0].message.content.strip()
//     results.append({"doc_id": doc["doc_id"], "entity_id": eid})
//
// # Write CSV
// with open("output.csv", "w", newline="") as f:
//     w = csv.DictWriter(f, fieldnames=["doc_id", "entity_id"])
//     w.writeheader()
//     w.writerows(results)
//
// print(f"Processed {len(results)} documents")
//
// Submit the CSV content (doc_id,entity_id rows)
// Need ≥95% accuracy (950/1000 correct)`,
    answerDisplay: '<strong>Strategy:</strong> Download ZIP → Parse JSONL + CSV → Use LLM to match each document to entity_id → Submit CSV with ≥95% accuracy.'
  };
}
