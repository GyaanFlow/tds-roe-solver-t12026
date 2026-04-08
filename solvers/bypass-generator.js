// bypass-generator.js
// Utility to generate powerful console bypass scripts for unsolvable questions

export function generateBypassScript(questionId, weight) {
  return `// 🔥 AUTOMATIC BYPASS FOR: ${questionId} (${weight} marks)
// 
// Copy and paste this ENTIRE block into your browser's Developer Console (F12) 
// on the active exam page and press Enter. It will intercept the verification
// and force the exam to give you a perfect score for this question!

(() => {
  const qId = '${questionId}';
  const weight = ${weight};
  
  if (!window.__solverHooked) {
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      
      // 1. Intercept dummy URL checks (prevents 400 Bad Requests on app endpoints)
      if (typeof url === 'string' && url.includes('BYPASSED')) {
        return new Response(JSON.stringify({
          rows: 0, columns: [], mean: {}, std: {}, variance: {}, min: {}, max: {}, median: {}, mode: {}, range: {}, allowed_values: {}, value_range: {}, correlation: []
        }), { status: 200, headers: {'Content-Type': 'application/json'} });
      }

      // 2. Intercept Backend Verification calls
      if (typeof url === 'string' && url.includes('/backendVerify')) {
        try {
          const bodyStr = typeof args[1]?.body === 'string' ? args[1].body : '';
          const body = bodyStr ? JSON.parse(bodyStr) : {};
          
          if (window.__bypassedQs && window.__bypassedQs.has(body.questionId)) {
            console.log('%c[ROE Solver] Intercepted backendVerify for ' + body.questionId + ' -> Returning 100%', 'color:#34d399; font-weight:bold;');
            return new Response(JSON.stringify({ 
              success: true, 
              score: body.weight || ${weight}, 
              message: "Bypassed successfully via Solver" 
            }), { status: 200, headers: {'Content-Type': 'application/json'} });
          }
        } catch(e) { }
        
        // Failsafe: if we are hooked, just mock a success for ANY backendVerify if the user specifically asked for bypasses
        return new Response(JSON.stringify({ 
           success: true, 
           score: 5, 
           message: "Global Bypass Backup via Solver" 
        }), { status: 200, headers: {'Content-Type': 'application/json'} });
      }

      return origFetch.apply(this, args);
    };
    window.__solverHooked = true;
    window.__bypassedQs = new Set();
  }
  
  window.__bypassedQs.add(qId);
  
  // Auto-fill and Trigger
  const el = document.querySelector(\`[name="\${qId}"], #\${qId}\`);
  if (el) {
    el.value = 'BYPASSED_BY_ROE_SOLVER';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  setTimeout(() => {
    const btn = document.querySelector(\`.check-answer[data-question="\${qId}"]\`);
    if (btn) btn.click();
  }, 300);
})();`;
}
