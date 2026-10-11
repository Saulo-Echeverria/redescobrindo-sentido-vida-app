// ===== MIMA: Assistente de Acompanhamento Cognitivo =====
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
  }
};

function getMimaResponse(actionType) {
  const modId = state.currentModule || 1;
  const modDict = MIMA_RESPONSES.exercises[modId] || MIMA_RESPONSES.default;
  return modDict[actionType] || MIMA_RESPONSES.default[actionType] || "Responda com honestidade e sem pressão.";
}

function renderMimaWidget() {
  return `
    <div class="mima-card" style="background:var(--card-bg, #1a1a2e); border:1px solid rgba(108,99,255,0.3); border-radius:14px; padding:16px; margin:20px 0; box-shadow:0 4px 20px rgba(0,0,0,0.2);">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <div style="width:32px; height:32px; border-radius:50%; background:var(--accent, #6C63FF); display:flex; align-items:center; justify-content:center; font-size:16px;">🧠</div>
        <div>
          <div style="font-weight:700; font-size:14px; color:var(--text, #fff);">Mima <span style="font-size:11px; font-weight:400; color:var(--text3, #a0a0c0);">— Guia Cognitiva</span></div>
          <div style="font-size:12px; color:var(--text2, #ccc);" id="mima-speech">Como posso ajudar na sua reflexão agora?</div>
        </div>
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
