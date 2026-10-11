// ===== SUPER MIMA 2.0: Motor de Reflexão Contextual =====
const SHORT_MEMORY = {
  lastResponses: [],
  maxResponses: 5
};

const SESSION_MEMORY = {
  currentModule: 1,
  currentExercise: null,
  lastIntent: null,
  interactionCount: 0,
  visitedExercises: []
};

function getProgramDataModule(modId) {
  if (typeof PROGRAM_DATA === 'undefined' || !PROGRAM_DATA.modules) return null;
  return PROGRAM_DATA.modules.find(m => m.id === Number(modId)) || PROGRAM_DATA.modules[0];
}

function getProgramDataExercise(modId, exId) {
  const mod = getProgramDataModule(modId);
  if (!mod || !mod.exercises) return null;
  return mod.exercises.find(ex => ex.id === exId) || mod.exercises[0];
}

function generateMimaReply(intent) {
  const modId = state.currentModule || 1;
  SESSION_MEMORY.currentModule = modId;
  SESSION_MEMORY.currentExercise = selectedMimaExerciseId;
  SESSION_MEMORY.lastIntent = intent;
  SESSION_MEMORY.interactionCount++;

  const mod = getProgramDataModule(modId);
  const ex = selectedMimaExerciseId ? getProgramDataExercise(modId, selectedMimaExerciseId) : (mod && mod.exercises ? mod.exercises[0] : null);

  let reply = "";

  if (intent === 'nao_entendi') {
    if (ex && ex.description) {
      reply = `Observe situações reais da sua vida relacionadas a: ${ex.title.toLowerCase()}.`;
    } else if (mod && mod.concept) {
      reply = `Pense no conceito de ${mod.concept.title.toLowerCase()} no seu dia a dia.`;
    } else {
      reply = "Não existe resposta perfeita. Existe apenas sua experiência real.";
    }
  } else if (intent === 'explique_melhor') {
    if (ex && ex.description) {
      reply = `Este exercício (${ex.title}) ajuda você a perceber padrões e significados práticos.`;
    } else if (mod) {
      reply = `O objetivo deste módulo é explorar ${mod.title.toLowerCase()} com honestidade.`;
    } else {
      reply = "Este passo foi desenhado para organizar suas reflexões de forma simples.";
    }
  } else if (intent === 'quero_refletir') {
    if (ex && ex.title) {
      reply = `O que mais chamou sua atenção no exercício ${ex.title}?`;
    } else if (mod && mod.concept) {
      reply = `Qual valor ou aprendizado deste módulo ressoa mais com você?`;
    } else {
      reply = "O que essa questão revela sobre as suas prioridades atuais?";
    }
  } else if (intent === 'quero_agir') {
    if (ex && ex.title) {
      reply = `Qual pequeno passo prático depende apenas de você hoje?`;
    } else {
      reply = `Escolha uma atitude simples para aplicar ainda esta semana.`;
    }
  } else {
    reply = "Observe sua experiência com curiosidade e sem julgamentos.";
  }

  // Word limit (max 20 words)
  const words = reply.split(/\s+/);
  if (words.length > 20) {
    reply = words.slice(0, 18).join(' ') + '...';
  }

  // Avoid repetition using short memory
  if (SHORT_MEMORY.lastResponses.includes(reply)) {
    if (intent === 'quero_refletir') reply = "Como você aplicaria essa reflexão na sua rotina amanhã?";
    else if (intent === 'quero_agir') reply = "Qual micro-ação você pode fazer em 5 minutos?";
  }

  SHORT_MEMORY.lastResponses.push(reply);
  if (SHORT_MEMORY.lastResponses.length > SHORT_MEMORY.maxResponses) {
    SHORT_MEMORY.lastResponses.shift();
  }

  return reply;
}

let selectedMimaExerciseId = null;

function onMimaExerciseChange(exId) {
  selectedMimaExerciseId = exId || null;
  SESSION_MEMORY.currentExercise = selectedMimaExerciseId;
  const speechEl = document.getElementById('mima-speech');
  if (speechEl) {
    if (exId) {
      const ex = getProgramDataExercise(state.currentModule || 1, exId);
      speechEl.textContent = ex ? `Focando em: ${ex.title}. Toque em uma dúvida.` : `Focando no Exercício ${exId}.`;
    } else {
      speechEl.textContent = "Selecione o exercício e toque em uma dúvida.";
    }
  }
}

function renderMimaWidget(m) {
  const exercises = m && m.exercises ? m.exercises : [];
  selectedMimaExerciseId = null;
  return `
    <div class="mima-card" style="background:var(--card-bg, #1a1a2e); border:1px solid rgba(108,99,255,0.3); border-radius:14px; padding:16px; margin:0 0 20px 0; box-shadow:0 4px 20px rgba(0,0,0,0.2);">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:var(--accent, #6C63FF); display:flex; align-items:center; justify-content:center; font-size:16px;">🧠</div>
          <div>
            <div style="font-weight:700; font-size:14px; color:var(--text, #fff);">Super Mima <span style="font-size:11px; font-weight:400; color:var(--text3, #a0a0c0);">— Guia Cognitiva 2.0</span></div>
            <div style="font-size:12px; color:var(--text2, #ccc);" id="mima-speech">Selecione o exercício e toque em uma dúvida.</div>
          </div>
        </div>
        ${exercises.length ? `
          <div>
            <select id="mima-exercise-select" class="form-control" style="font-size:11px; padding:6px 10px; height:auto; background:var(--bg2, #12121e); color:var(--text, #fff); border-radius:8px; border:1px solid rgba(108,99,255,0.3);" onchange="onMimaExerciseChange(this.value)">
              <option value="">🎯 Exercício Geral do Módulo</option>
              ${exercises.map(ex => `<option value="${ex.id}">Exercício ${ex.id}: ${ex.title}</option>`).join('')}
            </select>
          </div>
        ` : ''}
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">
        <button class="btn btn-ghost" style="font-size:12px; padding:6px 12px; border-radius:8px;" onclick="triggerMima('nao_entendi')">🤔 Não entendi</button>
        <button class="btn btn-ghost" style="font-size:12px; padding:6px 12px; border-radius:8px;" onclick="triggerMima('explique_melhor')">📖 Explique melhor</button>
        <button class="btn btn-ghost" style="font-size:12px; padding:6px 12px; border-radius:8px;" onclick="triggerMima('quero_refletir')">💭 Quero refletir</button>
        <button class="btn btn-ghost" style="font-size:12px; padding:6px 12px; border-radius:8px;" onclick="triggerMima('quero_agir')">🚀 Quero agir</button>
      </div>
    </div>
  `;
}

function triggerMima(actionType) {
  const speechEl = document.getElementById('mima-speech');
  if (!speechEl) return;
  const reply = generateMimaReply(actionType);
  speechEl.style.opacity = '0';
  setTimeout(() => {
    speechEl.textContent = reply;
    speechEl.style.opacity = '1';
    translateDOM(speechEl);
  }, 150);
}
