// ===== SUPER MIMA 3.0: Motor Cognitivo & Estratégico =====

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

const USER_MODEL = {
  engagement: 50,
  confusion: 0,
  autonomy: 50,
  reflectionDepth: 10,
  persistence: 50
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

function getUserJourney() {
  const total = typeof getTotalProgress === 'function' ? getTotalProgress() : { done: 0, total: 10, pct: 0 };
  const doneModules = (typeof state !== 'undefined' && state.moduleStatus) ?
    Object.values(state.moduleStatus).filter(s => s === 'done').length : 0;
  return {
    modulesCompletedCount: doneModules,
    totalProgressPct: total.pct,
    currentModuleId: (typeof state !== 'undefined' && state.currentModule) ? state.currentModule : 1
  };
}

function evaluateUserState(intent) {
  if (intent === 'nao_entendi') {
    USER_MODEL.confusion = Math.min(100, USER_MODEL.confusion + 25);
    USER_MODEL.reflectionDepth = Math.max(0, USER_MODEL.reflectionDepth - 10);
  } else if (intent === 'explique_melhor') {
    USER_MODEL.confusion = Math.max(0, USER_MODEL.confusion - 10);
  } else if (intent === 'quero_refletir') {
    USER_MODEL.confusion = Math.max(0, USER_MODEL.confusion - 15);
    USER_MODEL.reflectionDepth = Math.min(100, USER_MODEL.reflectionDepth + 20);
    USER_MODEL.engagement = Math.min(100, USER_MODEL.engagement + 10);
  } else if (intent === 'quero_agir') {
    USER_MODEL.autonomy = Math.min(100, USER_MODEL.autonomy + 15);
    USER_MODEL.persistence = Math.min(100, USER_MODEL.persistence + 15);
    USER_MODEL.engagement = Math.min(100, USER_MODEL.engagement + 10);
  }

  return {
    confused: USER_MODEL.confusion >= 40 || intent === 'nao_entendi',
    engaged: SESSION_MEMORY.interactionCount > 3 || USER_MODEL.engagement > 60,
    seekingReflection: intent === 'quero_refletir' || USER_MODEL.reflectionDepth > 40,
    seekingAction: intent === 'quero_agir',
    exerciseSelected: !!selectedMimaExerciseId,
    journey: getUserJourney()
  };
}

function chooseStrategy(userState, intent) {
  if (userState.confused) return "simplify";
  if (intent === 'explique_melhor') return "clarify";
  if (intent === 'quero_agir' || userState.seekingAction) return "act";
  if (intent === 'quero_refletir' || userState.engaged) return "deepen";
  return "reflect";
}

function buildResponseForStrategy(strategy, mod, ex) {
  const modTitle = mod ? mod.title : "deste módulo";
  const exTitle = ex ? ex.title : "deste exercício";

  switch (strategy) {
    case "simplify":
      if (ex && ex.description) {
        return `Não busque perfeição. Observe apenas como ${exTitle.toLowerCase()} se aplica na sua rotina.`;
      }
      return `Não existe resposta perfeita. Observe sua experiência real de forma simples.`;

    case "clarify":
      if (ex) {
        return `O objetivo de ${exTitle} é ajudar a perceber padrões reais de significado.`;
      }
      return `Este passo ajuda a organizar suas reflexões sobre ${modTitle.toLowerCase()} com clareza.`;

    case "deepen":
    case "reflect":
      if (ex) {
        return `O que mais chamou sua atenção no exercício ${exTitle}?`;
      }
      return `Qual valor ou aprendizado de ${modTitle} ressoa mais com você hoje?`;

    case "act":
      if (ex) {
        return `Qual pequeno passo prático do exercício ${exTitle} depende apenas de você hoje?`;
      }
      return `Qual micro-atitude simples você pode praticar ainda esta semana?`;

    default:
      return `Observe sua experiência com curiosidade e sem julgamentos.`;
  }
}

function generateMimaReply(intent) {
  const modId = (typeof state !== 'undefined' && state.currentModule) ? state.currentModule : 1;
  SESSION_MEMORY.currentModule = modId;
  SESSION_MEMORY.currentExercise = selectedMimaExerciseId;
  SESSION_MEMORY.lastIntent = intent;
  SESSION_MEMORY.interactionCount++;

  const userState = evaluateUserState(intent);
  const strategy = chooseStrategy(userState, intent);

  const mod = getProgramDataModule(modId);
  const ex = selectedMimaExerciseId ? getProgramDataExercise(modId, selectedMimaExerciseId) : (mod && mod.exercises ? mod.exercises[0] : null);

  let reply = buildResponseForStrategy(strategy, mod, ex);

  // Enforce max 20 words constraint
  const words = reply.split(/\s+/);
  if (words.length > 20) {
    reply = words.slice(0, 18).join(' ') + '...';
  }

  // Short memory deduplication
  if (SHORT_MEMORY.lastResponses.includes(reply)) {
    if (strategy === "deepen") reply = "Como você aplicaria essa reflexão na sua rotina amanhã?";
    else if (strategy === "act") reply = "Qual micro-ação você pode fazer em apenas 5 minutos?";
    else reply = "Foque na sua experiência com honestidade e sem pressão.";
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
      const ex = getProgramDataExercise((typeof state !== 'undefined' && state.currentModule) ? state.currentModule : 1, exId);
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
          <div style="width:32px; height:32px; border-radius:50%; background:var(--accent, #6C63FF); display:flex; align-items:center; justify-content:center; font-size:16px;">⭐</div>
          <div>
            <div style="font-weight:700; font-size:14px; color:var(--text, #fff);">⭐ Mima</div>
            <div style="font-size:11px; font-weight:400; color:var(--text3, #a0a0c0);">Sua Estrela do Norte na Jornada</div>
            <div style="font-size:12px; color:var(--text2, #ccc); margin-top:4px;" id="mima-speech">Selecione o exercício e toque em uma dúvida.</div>
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
