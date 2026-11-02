'use strict';
(() => {
  const log = document.querySelector('#messages');
  const input = document.querySelector('#message');
  const form = document.querySelector('#send');
  const clear = document.querySelector('#clear');
  const key = 'talha-nova-chat-v2';
  let chat = [];
  try { const saved = JSON.parse(localStorage.getItem(key)); if (Array.isArray(saved)) chat = saved.slice(-50).filter(m => (m.role === 'bot' || m.role === 'user') && typeof m.text === 'string'); } catch {}
  function append(role, text) {
    const intro = document.querySelector('#intro'); if (intro) intro.remove();
    const el = document.createElement('div'); el.className = `bubble ${role}`; el.textContent = text;
    log.append(el); log.scrollTop = log.scrollHeight; return el;
  }
  chat.forEach(m => append(m.role, m.text));
  function save() { try { localStorage.setItem(key, JSON.stringify(chat.slice(-50))); } catch {} }
  function reply(text) {
    const q = text.toLowerCase();
    if (/python|programming|learn to code/.test(q)) return 'A simple way to learn Python is to practice basics, conditionals, loops, functions, file handling, and small projects. Start with one manageable task and build on it.';
    if (/artificial intelligence|\bai\b|machine learning/.test(q)) return 'AI is a broad field where computers perform tasks involving patterns, prediction, or language. Try building a small tool with a clear problem before moving to large models.';
    if (/project|build|idea/.test(q)) return 'Project idea: build a study planner, an attendance tracker, or a simple expense manager. Add features one at a time and test them with real examples.';
    if (/study|exam|time|plan/.test(q)) return 'Try a focused study schedule: 40 minutes learning, 15 minutes practice, and 5 minutes reviewing mistakes. Small consistent sessions make a difference.';
    if (/hello|hi\b|hey/.test(q)) return "Hello! I'm Nova, a rule-based demonstration assistant. Ask me about Python, AI, study tips, or project ideas.";
    return "I'm a demonstration bot with a few predefined topics, so I might not understand that question. Try asking about Python, AI concepts, study planning, or programming projects.";
  }
  let busy = false;
  function send(text) {
    const message = text.trim(); if (!message || busy) return;
    input.value = ''; chat.push({role:'user',text:message}); append('user', message); save();
    busy = true; const bubble = append('bot', 'Thinking...');
    window.setTimeout(() => { const answer = reply(message); bubble.textContent = answer; chat.push({role:'bot',text:answer}); save(); busy = false; }, 550);
  }
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  document.querySelectorAll('[data-prompt]').forEach(b => b.addEventListener('click', () => send(b.dataset.prompt)));
  clear.addEventListener('click', () => { chat = []; save(); log.replaceChildren(); const intro = document.createElement('div'); intro.className = 'intro'; intro.id = 'intro'; const mark=document.createElement('span');mark.textContent='✳';const h=document.createElement('h2');h.textContent='Start a new conversation';const p=document.createElement('p');p.textContent='Choose a prompt or type a question.';intro.append(mark,h,p);log.append(intro);input.focus(); });
})();
