// Solver: GCP Cloud Functions HTTP Text Processor (AUTO-SOLVED)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-cloud-functions-http';
export const title = 'GCP Cloud Functions: HTTP Text Processor';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const words = ['mlops', 'devops', 'docker', 'kubernetes', 'terraform',
    'pipeline', 'container', 'serverless', 'microservice', 'artifact',
    'registry', 'endpoint', 'deployment', 'monitoring', 'observability'];

  // Shuffle
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const text = shuffled.slice(0, 5).join('-');
  const uppercase = text.toUpperCase();
  const charCount = text.replace(/-/g, '').replace(/ /g, '').length;
  const wordCount = text.replace(/-/g, ' ').split(/\s+/).length;
  const sha = (await sha256(text)).slice(0, 16);
  const verify = (await sha256(`upper:${uppercase}:chars:${charCount}:words:${wordCount}`)).slice(0, 12);

  return {
    type: 'guide',
    variant: `text="${text}" → ${uppercase}`,
    answer: `Deploy an HTTP function that processes text:
POST with {"text": "${text}"}

Expected response:
{
  "uppercase": "${uppercase}",
  "char_count": ${charCount},
  "word_count": ${wordCount},
  "sha256": "${sha}",
  "verify": "${verify}"
}

main.py:
import hashlib
import functions_framework

@functions_framework.http
def process_text(request):
    request_json = request.get_json(silent=True)
    if not request_json or 'text' not in request_json:
        return {'error': 'Missing text'}, 400
    text = str(request_json['text'])
    uppercase = text.upper()
    char_count = len(text.replace('-', '').replace(' ', ''))
    word_count = len(text.replace('-', ' ').split())
    sha = hashlib.sha256(text.encode()).hexdigest()[:16]
    verify = hashlib.sha256(
        f"upper:{uppercase}:chars:{char_count}:words:{word_count}".encode()
    ).hexdigest()[:12]
    return {'uppercase': uppercase, 'char_count': char_count,
            'word_count': word_count, 'sha256': sha, 'verify': verify}

Deploy to GCP Cloud Functions (or AWS/Azure)
Submit: your deployment URL`,
    answerDisplay: `Text: ${text}\nUppercase: ${uppercase}\nChars: ${charCount} | Words: ${wordCount}\nSHA256: ${sha}\nVerify: ${verify}`
  };
}
