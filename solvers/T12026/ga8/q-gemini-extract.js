// Solver: GCP Gemini JSON Data Extraction (AUTO-SOLVED)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-gemini-json-extract';
export const title = 'GCP AI Studio: Gemini JSON Data Extraction';

const FIRST_NAMES = ['Alice', 'Bob', 'Carlos', 'Diana', 'Elena', 'Frank', 'Grace', 'Hiroshi'];
const LAST_NAMES = ['Martinez', 'Chen', 'Patel', 'Johansson', 'Nakamura', 'Okafor', 'Kim', 'Silva'];
const CITIES = ['Tokyo', 'Berlin', 'Sao Paulo', 'Toronto', 'Seoul', 'Mumbai', 'Nairobi', 'Sydney'];
const ROLES = ['data scientist', 'ML engineer', 'devops lead', 'backend developer', 'cloud architect'];
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Netflix', 'Spotify', 'Airbnb'];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const pick = arr => arr[Math.floor(rng() * arr.length)];

  const data = {
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    age: Math.floor(rng() * 20) + 25,
    city: pick(CITIES),
    role: pick(ROLES),
    company: pick(COMPANIES),
  };

  const paragraph = `${data.name} is a ${data.age}-year-old ${data.role} working at ${data.company} in ${data.city}.`;

  const verifyInput = `${norm}:${data.name}:${data.age}:${data.city}:${data.role}:${data.company}`;
  const verifyHash = (await sha256(verifyInput)).slice(0, 14);

  return {
    type: 'solved',
    variant: `${data.name}, ${data.age}, ${data.city}, ${data.role} @ ${data.company}`,
    answer: `${data.name},${data.age},${data.city},${data.role},${data.company},${verifyHash}`,
    answerDisplay: `Paragraph: "${paragraph}"\n\nExtracted:\n  Name: ${data.name}\n  Age: ${data.age}\n  City: ${data.city}\n  Role: ${data.role}\n  Company: ${data.company}\n\nVerify Hash: ${verifyHash}`
  };
}
