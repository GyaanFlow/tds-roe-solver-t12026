import { page, card, details, escapeHtml } from '../p1/ui.js';
import { SECTIONS, buildIdea, checkIdea } from './roe-idea.js';

export const id = 'q-roe-ideas';
export const title = 'Invent an ROE question';

let lastText = '';

function widgetHtml() {
  const fields = SECTIONS.map((s) => `<div><label for="t3g4I-${s.key}">${escapeHtml(s.label)}: ${escapeHtml(s.ask)}</label><textarea id="t3g4I-${s.key}" rows="3" style="min-height:70px;font-family:inherit;font-size:13px"></textarea></div>`).join('');
  return [
    '<div id="t3g4Idea">',
    '<p class="p1-note"><strong>Think before you submit:</strong> an idea nobody values is likely to cost you 1 mark. Skipping costs nothing.</p>',
    `<div class="p1-grid">${fields}</div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3g4Idea.build()">Build my idea text</button><button type="button" class="p1-btn ghost" id="t3g4IdeaFill" disabled onclick="window._t3g4Idea.fill()">Put it in the answer box</button></div>',
    '<div id="t3g4IdeaOut" class="p1-status" role="status"></div>',
    '<pre id="t3g4IdeaText" class="mono" style="white-space:pre-wrap"></pre>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3g4Idea) return;
  const $ = (name) => document.getElementById(name);
  window._t3g4Idea = {
    build() {
      const out = $('t3g4IdeaOut');
      const parts = Object.fromEntries(SECTIONS.map((s) => [s.key, $(`t3g4I-${s.key}`)?.value]));
      const built = buildIdea(parts);
      const checked = checkIdea(built.text);
      lastText = built.ok ? built.text : '';
      if ($('t3g4IdeaFill')) $('t3g4IdeaFill').disabled = !built.ok;
      if ($('t3g4IdeaText')) $('t3g4IdeaText').textContent = built.ok ? built.text : '';
      if (out) {
        out.style.color = built.ok ? '#34d399' : '#f87171';
        out.textContent = built.ok ? `Ready (${built.text.length} characters).${checked.warnings?.length ? ` ${checked.warnings.join(' ')}` : ''}` : `Write at least a full sentence for: ${built.missing.join(', ')}.`;
      }
    },
    fill() {
      if (!lastText) return;
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: lastText, variant: 'ROE question idea', answerDisplay: '### Your idea\n\nPress **Check**, then **Save** if you want to take part.' });
      const out = $('t3g4IdeaOut');
      if (out) { out.style.color = '#34d399'; out.textContent = patched ? 'Done. Your idea is in the answer box. Press Check, then Save if you want to take part.' : 'Copy the text above into the exam box yourself, then press Check and Save.'; }
    },
  };
}

function buildGuide() {
  return page({
    title: '💡 Invent an ROE question',
    chips: [{ text: '0 marks', tone: '' }, { text: 'Bonus up to +10, or −1', tone: 'warn' }, { text: 'Optional', tone: 'ok' }],
    sections: [
      card('Read this first: it is a gamble', '<p class="p1-note"><strong>If you write an idea: up to +10 bonus marks if faculty think it is good (unlikely), or MINUS 1 if not (likely). If you leave it blank or under 10 characters: 0, no penalty.</strong></p><p>So only submit an idea you honestly think is strong. A rushed or generic idea most likely costs 1 mark. Skipping is a perfectly good choice.</p>', 'accent'),
      card('What a good idea looks like', '<p>A 45-minute ROE question should <strong>teach something useful</strong> even when everyone can use AI and friends, <strong>need a human contribution</strong> (an agent or solver alone should score low; a human supplying a missing ingredient is the key), and be <strong>engaging</strong>. For <strong>each idea</strong> write four parts:</p><ol><li><strong>Question:</strong> exactly what students would do.</li><li><strong>Evaluation:</strong> how an automated grader would score it.</li><li><strong>Learning:</strong> what they learn and why it is useful.</li><li><strong>Agent/solver resistance:</strong> why a bot alone scores poorly, and what a student can add to do better.</li></ol>'),
      card('Step by step for beginners', '<ol><li>Think of a task where the <strong>student has something a computer does not</strong>: their own photo, voice, device, local knowledge, a real-world measurement, or a judgement call.</li><li>Decide how a program could grade it automatically (for example, compare against hidden data, check a signature, measure accuracy on unseen examples).</li><li>Write the four parts in the boxes below in plain sentences. Be specific: numbers, formats, and what exactly the student submits.</li><li>Press <strong>Build my idea text</strong>, read it once, and decide honestly whether it is strong.</li><li>If yes, put it in the answer box, then <strong>Check</strong> and <strong>Save</strong>. If not, leave the box empty and skip.</li></ol>'),
      card('Idea builder', widgetHtml(), 'accent'),
      details('Quick quality checklist', '<ul><li>Could an AI agent do the whole thing with no human input? If yes, redesign it.</li><li>Can a script grade it without a person reading it?</li><li>Does the student learn a real skill, not just follow steps?</li><li>Is the human ingredient clear (what exactly only the student can supply)?</li><li>Could it be done in 45 minutes?</li></ul>'),
    ],
  });
}

export async function solve() {
  lastText = '';
  register();
  return {
    type: 'guide',
    answer: 'Optional and risky: write an idea with Question, Evaluation, Learning and Agent/solver resistance only if it is strong (up to +10 bonus, but likely −1). Leaving it blank costs nothing.',
    variant: 'Optional · bonus or −1',
    guide: buildGuide(),
    answerDisplay: '### Optional: invent an ROE question\n\nSubmitting an idea risks a −1 penalty (likely) for a small chance of up to +10. Leave the box blank to skip with no penalty.',
    debug: { question: 'Q4', needsUserInput: true, optional: true },
  };
}
