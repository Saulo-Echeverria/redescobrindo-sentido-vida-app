// ===== MIMA: Assistente de Acompanhamento Cognitivo =====
let selectedMimaExerciseId = null;

const MIMA_RESPONSES = {
  default: {
    'nao_entendi': "Responda sem procurar perfeição. Busque apenas honestidade.",
    'explique_melhor': "Pense em necessidades que você gostaria de ajudar a resolver.",
    'quero_refletir': "Qual valor aparece mais forte nessa resposta?",
    'quero_agir': "Qual pequeno passo você poderia dar esta semana?"
  },
  exercises: {
    1: {
      'nao_entendi': "O vazio existencial surge quando falta sentido. Nomeie sua angústia.",
      'explique_melhor': "Identifique momentos onde sentiu apatia ou tédio profundo.",
      'quero_refletir': "O que essa falta de sentido tenta lhe ensinar?",
      'quero_agir': "Escolha uma pequena atividade significativa hoje."
    },
    2: {
      'nao_entendi': "A vontade de sentido é o motor humano. O que te move?",
      'explique_melhor': "Pense no que realmente importa além do conforto material.",
      'quero_refletir': "Qual causa ou pessoa merece sua dedicação?",
      'quero_agir': "Dedique 15 minutos hoje ao que te inspira."
    },
    3: {
      'nao_entendi': "Você é livre para escolher sua atitude perante as circunstâncias.",
      'explique_melhor': "Assuma a responsabilidade pelas suas escolhas atuais.",
      'quero_refletir': "Qual atitude você pode mudar agora mesmo?",
      'quero_agir': "Tome uma decisão consciente hoje."
    },
    4: {
      'nao_entendi': "Valores são bússolas. Escolha os que guiam sua essência.",
      'explique_melhor': "Pense no que você defenderia mesmo sem aplausos.",
      'quero_refletir': "Suas escolhas diárias refletem esses valores?",
      'quero_agir': "Pratique um valor escolhido hoje."
    },
    5: {
      'nao_entendi': "O sentido se manifesta criando, vivenciando ou agindo.",
      'explique_melhor': "Conecte seu trabalho e afeto a um propósito maior.",
      'quero_refletir': "Como você pode servir ao outro hoje?",
      'quero_agir': "Realize uma ação com amor e entrega."
    },
    6: {
      'nao_entendi': "O sofrimento inevitável pode ser transformado por nossa atitude.",
      'explique_melhor': "Dignidade e coragem mudam o peso da dor.",
      'quero_refletir': "Qual aprendizado reside nessa dificuldade?",
      'quero_agir': "Encare um desafio pendente com coragem."
    },
    7: {
      'nao_entendi': "Legado é o que deixamos no coração e na vida do mundo.",
      'explique_melhor': "Pense em como gostaria de ser lembrado por suas virtudes.",
      'quero_refletir': "Sua vida atual constrói o legado que deseja?",
      'quero_agir': "Faça algo hoje que importe no longo prazo."
    }
  },
  exercisesSpecific: {
    '1.1': { 'nao_entendi': "Avalie cada área da vida com sinceridade. Sem julgamentos.", 'explique_melhor': "Onde há vazio ou insatisfação profunda?", 'quero_refletir': "Qual área drena mais sua energia?", 'quero_agir': "Foque em equilibrar uma única área hoje." },
    '1.2': { 'nao_entendi': "Anote o que causa tédio ou apatia na rotina.", 'explique_melhor': "Reconhecer o sintoma é o primeiro passo para a cura.", 'quero_refletir': "O que falta preencher no seu dia a dia?", 'quero_agir': "Inove em uma pequena rotina hoje." },
    '2.1': { 'nao_entendi': "Escreva livremente o que desperta seu entusiasmo.", 'explique_melhor': "Busque além do ganho financeiro.", 'quero_refletir': "O que faria mesmo sem remuneração?", 'quero_agir': "Dedique 20 minutos a essa paixão." },
    '3.1': { 'nao_entendi': "Você não controla o evento, mas controla sua resposta.", 'explique_melhor': "Assuma o protagonismo da sua história.", 'quero_refletir': "Onde você está terceirizando sua culpa?", 'quero_agir': "Mude uma postura passiva por uma ativa." },
    '4.1': { 'nao_entendi': "Selecione valores que definem seu caráter essencial.", 'explique_melhor': "Valores orientam decisões difíceis.", 'quero_refletir': "Suas ações de ontem honraram esses valores?", 'quero_agir': "Tome uma decisão baseada no seu principal valor." },
    '5.1': { 'nao_entendi': "Ação e amor dão densidade à existência.", 'explique_melhor': "Pense em quem se beneficia do seu esforço.", 'quero_refletir': "Como você pode amar mais o que faz?", 'quero_agir': "Surpreenda alguém com um ato de cuidado." },
    '6.1': { 'nao_entendi': "Encontre sentido mesmo nas situações intransmutáveis.", 'explique_melhor': "A atitude perante o sofrimento define o ser humano.", 'quero_refletir': "Como você cresceu através da dor?", 'quero_agir': "Aceite o que não pode mudar e aja no que pode." },
    '7.1': { 'nao_entendi': "Imagine seu legado no final da jornada.", 'explique_melhor': "O que permanece após nossa partida?", 'quero_refletir': "Suas escolhas atuais honram esse legado?", 'quero_agir': "Faça hoje uma contribuição duradoura." }
  }
};

function onMimaExerciseChange(exId) {
  selectedMimaExerciseId = exId;
  const speechEl = document.getElementById('mima-speech');
  if (speechEl) {
    speechEl.textContent = exId ? `Focando no Exercício ${exId}. Como posso ajudar?` : "Selecione o exercício e toque em uma dúvida.";
  }
}

function getMimaResponse(actionType) {
  const modId = state.currentModule || 1;
  if (selectedMimaExerciseId && MIMA_RESPONSES.exercisesSpecific[selectedMimaExerciseId]) {
    const exDict = MIMA_RESPONSES.exercisesSpecific[selectedMimaExerciseId];
    if (exDict[actionType]) return exDict[actionType];
  }
  const modDict = MIMA_RESPONSES.exercises[modId] || MIMA_RESPONSES.default;
  return modDict[actionType] || MIMA_RESPONSES.default[actionType] || "Responda com honestidade e sem pressão.";
}

function renderMimaWidget(m) {
  const exercises = m && m.exercises ? m.exercises : [];
  selectedMimaExerciseId = null; // reset on re-render
  return `
    <div class="mima-card" style="background:var(--card-bg, #1a1a2e); border:1px solid rgba(108,99,255,0.3); border-radius:14px; padding:16px; margin:0 0 20px 0; box-shadow:0 4px 20px rgba(0,0,0,0.2);">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:var(--accent, #6C63FF); display:flex; align-items:center; justify-content:center; font-size:16px;">🧠</div>
          <div>
            <div style="font-weight:700; font-size:14px; color:var(--text, #fff);">Mima <span style="font-size:11px; font-weight:400; color:var(--text3, #a0a0c0);">— Guia Cognitiva</span></div>
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
  const reply = getMimaResponse(actionType);
  speechEl.style.opacity = '0';
  setTimeout(() => {
    speechEl.textContent = reply;
    speechEl.style.opacity = '1';
    translateDOM(speechEl);
  }, 150);
}
