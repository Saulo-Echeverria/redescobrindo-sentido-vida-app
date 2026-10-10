// ===== SISTEMA DE TROFÉUS E CONQUISTAS =====

const ACHIEVEMENTS_KEY = 'rsv_achievements';

const ACHIEVEMENTS_DATA = [
  // ── Início da Jornada ────────────────────────────────────────────────────────
  {
    id: 'first_step',
    title: 'Primeiro Passo',
    description: 'Você configurou seu perfil e iniciou a jornada.',
    icon: '🌱',
    rarity: 'common',
    xp: 50,
    trigger: 'setup_done',
  },
  {
    id: 'intention_set',
    title: 'Intenção Clara',
    description: 'Você definiu sua intenção para o programa.',
    icon: '🎯',
    rarity: 'common',
    xp: 30,
    trigger: 'intention_written',
  },

  // ── Termômetro ───────────────────────────────────────────────────────────────
  {
    id: 'thermometer_pre',
    title: 'Ponto de Partida',
    description: 'Você avaliou seu sentido de vida antes de começar.',
    icon: '🌡️',
    rarity: 'common',
    xp: 40,
    trigger: 'thermometer_pre',
  },
  {
    id: 'thermometer_all',
    title: 'Observador Fiel',
    description: 'Você avaliou o Termômetro em todos os momentos do programa.',
    icon: '📊',
    rarity: 'rare',
    xp: 150,
    trigger: 'thermometer_all',
  },
  {
    id: 'thermometer_growth',
    title: 'Crescimento Real',
    description: 'Seu sentido de vida cresceu 3 ou mais pontos ao longo do programa.',
    icon: '📈',
    rarity: 'epic',
    xp: 200,
    trigger: 'thermometer_growth_3',
  },

  // ── Módulos ──────────────────────────────────────────────────────────────────
  {
    id: 'module_1_done',
    title: 'Despertar',
    description: 'Você completou o Módulo 1 — Despertar Existencial.',
    icon: '🌅',
    rarity: 'common',
    xp: 100,
    trigger: 'module_1_complete',
    moduleId: 1,
  },
  {
    id: 'module_2_done',
    title: 'Narrador da Própria História',
    description: 'Você completou o Módulo 2 — Compreendendo Sua História.',
    icon: '📖',
    rarity: 'common',
    xp: 100,
    trigger: 'module_2_complete',
    moduleId: 2,
  },
  {
    id: 'module_3_done',
    title: 'Guardião dos Valores',
    description: 'Você completou o Módulo 3 — Descobrindo Valores Essenciais.',
    icon: '💎',
    rarity: 'common',
    xp: 100,
    trigger: 'module_3_complete',
    moduleId: 3,
  },
  {
    id: 'module_4_done',
    title: 'Portador de Propósito',
    description: 'Você completou o Módulo 4 — Encontrando Propósito.',
    icon: '🎯',
    rarity: 'uncommon',
    xp: 120,
    trigger: 'module_4_complete',
    moduleId: 4,
  },
  {
    id: 'module_5_done',
    title: 'Alma Transcendente',
    description: 'Você completou o Módulo 5 — Autotranscendência.',
    icon: '🦋',
    rarity: 'uncommon',
    xp: 120,
    trigger: 'module_5_complete',
    moduleId: 5,
  },
  {
    id: 'module_6_done',
    title: 'Alquimista do Sofrimento',
    description: 'Você completou o Módulo 6 — Transformando o Sofrimento.',
    icon: '🔥',
    rarity: 'rare',
    xp: 150,
    trigger: 'module_6_complete',
    moduleId: 6,
  },
  {
    id: 'module_7_done',
    title: 'Arquiteto do Sentido',
    description: 'Você completou o Módulo 7 — Construindo uma Vida com Significado.',
    icon: '🌟',
    rarity: 'epic',
    xp: 200,
    trigger: 'module_7_complete',
    moduleId: 7,
  },

  // ── Programa Completo ────────────────────────────────────────────────────────
  {
    id: 'program_complete',
    title: 'Redescobridor do Sentido',
    description: 'Você completou todos os 7 módulos do programa. Viktor Frankl estaria orgulhoso.',
    icon: '🏆',
    rarity: 'legendary',
    xp: 500,
    trigger: 'all_modules_complete',
  },
  {
    id: 'manifesto_written',
    title: 'Autor da Própria Vida',
    description: 'Você escreveu seu Manifesto de Vida pessoal.',
    icon: '✍️',
    rarity: 'epic',
    xp: 200,
    trigger: 'manifesto_complete',
  },

  // ── Exercícios Especiais ─────────────────────────────────────────────────────
  {
    id: 'ikigai_complete',
    title: 'Razão de Ser',
    description: 'Você preencheu todas as dimensões do Ikigai.',
    icon: '✨',
    rarity: 'uncommon',
    xp: 80,
    trigger: 'ikigai_all_filled',
  },
  {
    id: 'purpose_written',
    title: 'Voz do Propósito',
    description: 'Você escreveu sua Declaração de Propósito Pessoal.',
    icon: '📣',
    rarity: 'uncommon',
    xp: 80,
    trigger: 'purpose_statement_written',
  },
  {
    id: 'values_selected',
    title: 'Bússola Existencial',
    description: 'Você identificou seus 5 valores essenciais.',
    icon: '🧭',
    rarity: 'common',
    xp: 60,
    trigger: 'values_5_selected',
  },
  {
    id: 'timeline_complete',
    title: 'Cronista da Alma',
    description: 'Você mapeou os 5 momentos mais marcantes da sua vida.',
    icon: '⏳',
    rarity: 'uncommon',
    xp: 80,
    trigger: 'timeline_5_moments',
  },
  {
    id: 'goals_set',
    title: 'Visionário dos 90 Dias',
    description: 'Você definiu 3 metas alinhadas ao seu propósito.',
    icon: '📅',
    rarity: 'common',
    xp: 60,
    trigger: 'goals_3_set',
  },

  // ── Diário e Reflexão ────────────────────────────────────────────────────────
  {
    id: 'diary_first',
    title: 'Primeiro Registro',
    description: 'Você fez sua primeira reflexão no Diário Semanal.',
    icon: '📔',
    rarity: 'common',
    xp: 40,
    trigger: 'diary_first_entry',
  },
  {
    id: 'diary_all',
    title: 'Diário Completo',
    description: 'Você preencheu o Diário Semanal de todos os 7 módulos.',
    icon: '📚',
    rarity: 'rare',
    xp: 150,
    trigger: 'diary_all_7',
  },

  // ── Práticas Diárias ─────────────────────────────────────────────────────────
  {
    id: 'practices_week',
    title: 'Semana de Ouro',
    description: 'Você completou todas as práticas diárias por 7 dias seguidos.',
    icon: '🥇',
    rarity: 'rare',
    xp: 150,
    trigger: 'practices_7_days_complete',
  },
  {
    id: 'gratitude_streak',
    title: 'Coração Grato',
    description: 'Você praticou gratidão por 5 dias consecutivos.',
    icon: '🙏',
    rarity: 'uncommon',
    xp: 80,
    trigger: 'gratitude_5_days',
  },

  // ── PDF e Compartilhamento ───────────────────────────────────────────────────
  {
    id: 'pdf_exported',
    title: 'Memória Viva',
    description: 'Você exportou seu relatório completo de progresso.',
    icon: '📄',
    rarity: 'common',
    xp: 50,
    trigger: 'pdf_exported',
  },

  // ── Velocidade e Dedicação ───────────────────────────────────────────────────
  {
    id: 'speed_runner',
    title: 'Jornada Intensa',
    description: 'Você completou 3 módulos em menos de 7 dias.',
    icon: '⚡',
    rarity: 'rare',
    xp: 120,
    trigger: 'three_modules_7_days',
  },
  {
    id: 'deep_diver',
    title: 'Mergulhador Profundo',
    description: 'Você respondeu todos os exercícios de um módulo com mais de 50 palavras cada.',
    icon: '🤿',
    rarity: 'epic',
    xp: 180,
    trigger: 'deep_answers_module',
  },
];

// ── Raridade → cor e label ───────────────────────────────────────────────────
const RARITY_CONFIG = {
  common:    { label: 'Comum',    color: '#a0a0c0', bg: 'rgba(160,160,192,0.12)', border: 'rgba(160,160,192,0.3)' },
  uncommon:  { label: 'Incomum',  color: '#43B89C', bg: 'rgba(67,184,156,0.12)',  border: 'rgba(67,184,156,0.3)'  },
  rare:      { label: 'Raro',     color: '#6C63FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.3)'  },
  epic:      { label: 'Épico',    color: '#A855F7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)'  },
  legendary: { label: 'Lendário', color: '#F7B731', bg: 'rgba(247,183,49,0.15)', border: 'rgba(247,183,49,0.4)'  },
};

// ── Estado das conquistas ────────────────────────────────────────────────────
function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : { unlocked: {}, totalXP: 0, streak: 0, lastActiveDate: null };
  } catch { return { unlocked: {}, totalXP: 0, streak: 0, lastActiveDate: null }; }
}

function saveAchievements(ach) {
  try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ach)); } catch {}
}

let achievements = loadAchievements();

// ── Desbloquear conquista ────────────────────────────────────────────────────
function unlockAchievement(triggerId) {
  const achievement = ACHIEVEMENTS_DATA.find(a => a.trigger === triggerId);
  if (!achievement) return;
  if (achievements.unlocked[achievement.id]) return; // já desbloqueado

  achievements.unlocked[achievement.id] = {
    unlockedAt: new Date().toISOString(),
    xp: achievement.xp,
  };
  achievements.totalXP = (achievements.totalXP || 0) + achievement.xp;
  saveAchievements(achievements);

  // Mostrar celebração
  showAchievementToast(achievement);

  // Se for módulo completo, mostrar modal de celebração
  if (achievement.trigger.startsWith('module_') && achievement.trigger.endsWith('_complete')) {
    setTimeout(() => showModuleCelebration(achievement), 800);
  }

  // Se for programa completo
  if (achievement.trigger === 'all_modules_complete') {
    setTimeout(() => showProgramCelebration(), 1200);
  }
}

// ── Verificar e disparar conquistas ─────────────────────────────────────────
function checkAchievements() {
  if (typeof state === 'undefined') return;
  const s = state;

  // Setup feito
  if (s.setupDone) unlockAchievement('setup_done');
  if (s.intention && s.intention.trim().length > 10) unlockAchievement('intention_written');

  // Termômetro
  if (s.thermometer && s.thermometer['pre']) unlockAchievement('thermometer_pre');

  const thermoKeys = ['pre', 'mod1', 'mod2', 'mod3', 'mod4', 'mod5', 'mod6', 'mod7'];
  if (thermoKeys.every(k => s.thermometer && s.thermometer[k])) {
    unlockAchievement('thermometer_all');
  }
  const pre = s.thermometer && s.thermometer['pre'];
  const last = s.thermometer && (s.thermometer['mod7'] || s.thermometer['mod6'] || s.thermometer['mod5']);
  if (pre && last && (last - pre) >= 3) unlockAchievement('thermometer_growth_3');

  // Módulos
  for (let i = 1; i <= 7; i++) {
    const checks = s.checklists && s.checklists[i];
    const mod = PROGRAM_DATA && PROGRAM_DATA.modules[i - 1];
    if (checks && mod && checks.filter(Boolean).length === mod.checklist.length) {
      unlockAchievement(`module_${i}_complete`);
    }
  }

  // Todos os módulos
  const allDone = [1,2,3,4,5,6,7].every(i => {
    const checks = s.checklists && s.checklists[i];
    const mod = PROGRAM_DATA && PROGRAM_DATA.modules[i - 1];
    return checks && mod && checks.filter(Boolean).length === mod.checklist.length;
  });
  if (allDone) unlockAchievement('all_modules_complete');

  // Manifesto
  const manifesto = s.manifesto || {};
  const manifestoFilled = Object.values(manifesto).filter(v => v && v.trim().length > 20).length >= 4;
  if (manifestoFilled) unlockAchievement('manifesto_complete');

  // Ikigai
  const ikigai = s.ikigai || {};
  const ikigaiFilled = ['love', 'good', 'world', 'paid', 'ikigai'].every(k => ikigai[k] && ikigai[k].trim().length > 5);
  if (ikigaiFilled) unlockAchievement('ikigai_all_filled');

  // Propósito
  if (s.purposeStatement && s.purposeStatement.trim().length > 20) {
    unlockAchievement('purpose_statement_written');
  }

  // Valores
  if (s.valuesSelected && s.valuesSelected.length >= 5) unlockAchievement('values_5_selected');

  // Linha do tempo
  const moments = s.timelineMoments || [];
  if (moments.filter(m => m.text && m.text.trim().length > 10).length >= 5) {
    unlockAchievement('timeline_5_moments');
  }

  // Metas
  const goals = s.goals90 || [];
  if (goals.filter(g => g.text && g.text.trim().length > 5).length >= 3) {
    unlockAchievement('goals_3_set');
  }

  // Diário
  const diary = s.weeklyDiary || {};
  const diaryEntries = Object.values(diary).filter(d => d.discovery && d.discovery.trim().length > 10);
  if (diaryEntries.length >= 1) unlockAchievement('diary_first_entry');
  if (diaryEntries.length >= 7) unlockAchievement('diary_all_7');

  // Práticas diárias
  const practices = s.dailyPractices || {};
  const practiceData = practices['5.3'] || {};
  const allPracticesDone = Object.keys(practiceData).length >= 5 &&
    Object.values(practiceData).every(days =>
      Object.values(days).filter(Boolean).length >= 7
    );
  if (allPracticesDone) unlockAchievement('practices_7_days_complete');

  // Gratidão (prática 0 = gratidão)
  const gratitudeDays = practiceData[0] ? Object.values(practiceData[0]).filter(Boolean).length : 0;
  if (gratitudeDays >= 5) unlockAchievement('gratitude_5_days');

  // Três módulos concluídos dentro de uma janela de sete dias.
  const completionTimes = PROGRAM_DATA.modules
    .filter(module => {
      const checks = s.checklists && s.checklists[module.id];
      return checks && checks.length === module.checklist.length && checks.every(Boolean);
    })
    .map(module => Date.parse(((s.moduleDates || {})[module.id] || {}).end || ''))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const completedThreeInAWeek = completionTimes.some((start, index) =>
    completionTimes.slice(index + 1).filter(end => end - start < 7 * 86400000).length >= 2
  );
  if (completedThreeInAWeek) unlockAchievement('three_modules_7_days');

  if (PROGRAM_DATA && PROGRAM_DATA.modules.some(hasDeepAnswers)) {
    unlockAchievement('deep_answers_module');
  }

  // Atualizar streak
  updateStreak();
}

function hasDeepAnswers(module) {
  const wordCount = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const isLongAnswer = text => wordCount(text) > 50;

  const checks = module.exercises.map(exercise => {
    const response = (state.exercises || {})[exercise.id] || {};
    switch (exercise.type) {
      case 'questions':
        return exercise.questions.every((_, index) => isLongAnswer((response.answers || {})[index]));
      case 'connections_map':
        return exercise.questions.every((_, index) => isLongAnswer((response.answers || {})[index]));
      case 'integration':
        return exercise.modules.every((_, index) => isLongAnswer((response.answers || {})[index]));
      case 'letter':
      case 'textarea':
        return isLongAnswer(response.text);
      case 'timeline':
        return (state.timelineMoments || []).length >= exercise.moments &&
          (state.timelineMoments || []).slice(0, exercise.moments)
            .every(moment => isLongAnswer(moment.text));
      case 'rewrite':
        return exercise.fields.every((_, index) => isLongAnswer((response.fields || {})[index]));
      case 'ikigai':
        return ['love', 'good', 'world', 'paid', 'ikigai']
          .every(key => isLongAnswer((state.ikigai || {})[key]));
      case 'purpose_statement':
        return isLongAnswer(state.purposeStatement) &&
          isLongAnswer(((state.exercises || {})['4.2'] || {}).manifestation);
      case 'goals_90days':
        return (state.goals90 || []).length >= exercise.count &&
          (state.goals90 || []).slice(0, exercise.count)
            .every(goal => isLongAnswer(goal.text));
      default:
        return true;
    }
  });

  const hasTextExercises = module.exercises.some(exercise =>
    ['questions', 'connections_map', 'integration', 'letter', 'textarea', 'timeline',
      'rewrite', 'ikigai', 'purpose_statement', 'goals_90days'].includes(exercise.type)
  );
  return hasTextExercises && checks.every(Boolean);
}

// ── Streak diário ────────────────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  const last = achievements.lastActiveDate;

  if (last === today) return; // já contou hoje

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (last === yesterdayStr) {
    achievements.streak = (achievements.streak || 0) + 1;
  } else if (last !== today) {
    achievements.streak = 1; // reinicia streak
  }

  achievements.lastActiveDate = today;
  saveAchievements(achievements);
}

// ── Toast de conquista ───────────────────────────────────────────────────────
function showAchievementToast(achievement) {
  const rarity = RARITY_CONFIG[achievement.rarity];
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.style.cssText = `
    background: ${rarity.bg};
    border: 1px solid ${rarity.border};
    border-radius: 14px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: achievementSlideIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
    max-width: 340px;
    cursor: pointer;
  `;
  toast.innerHTML = `
    <div style="font-size:32px;flex-shrink:0;filter:drop-shadow(0 0 8px ${rarity.color})">${achievement.icon}</div>
    <div style="flex:1">
      <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${rarity.color};margin-bottom:3px">
        🏆 Conquista Desbloqueada · ${rarity.label}
      </div>
      <div style="font-size:14px;font-weight:700;color:#e8e8f0;margin-bottom:2px">${achievement.title}</div>
      <div style="font-size:12px;color:#a0a0c0;line-height:1.4">${achievement.description}</div>
      <div style="font-size:11px;color:${rarity.color};margin-top:4px;font-weight:700">+${achievement.xp} XP</div>
    </div>
  `;
  toast.onclick = () => {
    toast.style.animation = 'achievementSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
    navigate('achievements');
  };
  container.appendChild(toast);

  // Vibração háptica (mobile)
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'achievementSlideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// ── Modal de celebração de módulo ────────────────────────────────────────────
function showModuleCelebration(achievement) {
  const moduleId = achievement.moduleId;
  const mod = PROGRAM_DATA.modules[moduleId - 1];
  const rarity = RARITY_CONFIG[achievement.rarity];
  const quote = getRandomModuleQuote(moduleId);

  const overlay = document.createElement('div');
  overlay.id = 'celebration-overlay';
  overlay.className = 'celebration-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 10000;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.4s ease;
  `;

  overlay.innerHTML = `
    <div class="celebration-modal" style="
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid ${mod.color};
      border-radius: 24px;
      padding: clamp(20px, 5vw, 40px) clamp(18px, 6vw, 36px);
      max-width: 480px;
      width: 100%;
      text-align: center;
      position: relative;
      animation: celebrationPop 0.6s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <!-- Confetti particles -->
      <div class="confetti-container" id="confetti-container"></div>

      <!-- Glow background -->
      <div style="
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        width:300px; height:300px;
        background: radial-gradient(circle, ${mod.color}22 0%, transparent 70%);
        pointer-events:none;
      "></div>

      <!-- Trophy icon -->
      <div style="font-size:72px;margin-bottom:8px;filter:drop-shadow(0 0 20px ${mod.color});animation:iconBounce 1s ease infinite alternate">${achievement.icon}</div>

      <!-- Rarity badge -->
      <div style="
        display:inline-block;
        background:${rarity.bg}; border:1px solid ${rarity.border};
        border-radius:20px; padding:4px 14px;
        font-size:11px; font-weight:800; text-transform:uppercase;
        letter-spacing:1.5px; color:${rarity.color};
        margin-bottom:16px;
      ">${rarity.label}</div>

      <!-- Title -->
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${mod.color};margin-bottom:8px">
        Módulo ${moduleId} Concluído!
      </div>
      <div style="font-size:28px;font-weight:800;color:#fff;margin-bottom:6px">${achievement.title}</div>
      <div style="font-size:14px;color:#a0a0c0;margin-bottom:24px;line-height:1.6">${achievement.description}</div>

      <!-- XP Badge -->
      <div style="
        display:inline-flex; align-items:center; gap:8px;
        background:rgba(247,183,49,0.15); border:1px solid rgba(247,183,49,0.3);
        border-radius:20px; padding:8px 20px; margin-bottom:24px;
      ">
        <span style="font-size:18px">⭐</span>
        <span style="font-size:16px;font-weight:800;color:#F7B731">+${achievement.xp} XP</span>
        <span style="font-size:12px;color:#a0a0c0">· Total: ${achievements.totalXP} XP</span>
      </div>

      <!-- Quote -->
      ${quote ? `
        <div style="
          background:rgba(255,255,255,0.04); border-left:3px solid ${mod.color};
          border-radius:0 10px 10px 0; padding:14px 16px;
          margin-bottom:28px; text-align:left;
        ">
          <div style="font-size:13px;font-style:italic;color:#c0c0e0;line-height:1.7">"${quote.text}"</div>
          <div style="font-size:11px;color:${mod.color};font-weight:700;margin-top:6px">— ${quote.author}</div>
        </div>
      ` : ''}

      <!-- Progress to next -->
      ${moduleId < 7 ? `
        <div style="font-size:13px;color:#a0a0c0;margin-bottom:20px">
          🚀 Próximo: <strong style="color:#fff">Módulo ${moduleId + 1} — ${PROGRAM_DATA.modules[moduleId].title}</strong>
        </div>
      ` : `
        <div style="font-size:14px;color:#F7B731;font-weight:700;margin-bottom:20px">
          🏆 Você completou todos os módulos!
        </div>
      `}

      <!-- Actions -->
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button onclick="closeCelebration()" style="
          background:transparent; color:#a0a0c0; border:1px solid rgba(255,255,255,0.1);
          border-radius:10px; padding:10px 20px; font-size:13px; font-weight:600;
          cursor:pointer;
        ">Fechar</button>
        ${moduleId < 7 ? `
          <button onclick="closeCelebration(); navigate('module', ${moduleId + 1})" style="
            background:${mod.color}; color:#fff; border:none;
            border-radius:10px; padding:10px 24px; font-size:13px; font-weight:700;
            cursor:pointer;
          ">▶ Próximo Módulo</button>
        ` : `
          <button onclick="closeCelebration(); navigate('certificate')" style="
            background:linear-gradient(135deg,#F7B731,#FF6584); color:#fff; border:none;
            border-radius:10px; padding:10px 24px; font-size:13px; font-weight:700;
            cursor:pointer;
          ">🏆 Ver Certificado</button>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCelebration(); });

  // Lançar confetti
  setTimeout(() => launchConfetti(), 300);
}

// ── Celebração do programa completo ─────────────────────────────────────────
function showProgramCelebration() {
  const overlay = document.createElement('div');
  overlay.id = 'program-celebration-overlay';
  overlay.className = 'celebration-overlay';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:10001;
    background:rgba(0,0,0,0.92);
    backdrop-filter:blur(16px);
    display:flex; align-items:center; justify-content:center;
    padding:16px;
    animation:fadeIn 0.5s ease;
  `;
  overlay.innerHTML = `
    <div class="program-celebration-modal" style="
      background:linear-gradient(160deg,#0f0f1a,#1a1a2e);
      border:2px solid #F7B731;
      border-radius:24px; padding:clamp(24px, 6vw, 48px) clamp(20px, 5vw, 40px);
      max-width:520px; width:100%;
      text-align:center;
      animation:celebrationPop 0.7s cubic-bezier(0.34,1.56,0.64,1);
      position:relative;
    ">
      <div class="confetti-container" id="confetti-program"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:radial-gradient(circle,rgba(247,183,49,0.08) 0%,transparent 70%);pointer-events:none"></div>

      <div style="font-size:24px;letter-spacing:12px;color:#F7B731;margin-bottom:20px">✦ ✦ ✦</div>
      <div style="font-size:80px;margin-bottom:12px;animation:iconBounce 1s ease infinite alternate">🏆</div>
      <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#F7B731;margin-bottom:8px">Conquista Lendária</div>
      <div style="font-size:32px;font-weight:800;color:#fff;margin-bottom:8px">Redescobridor do Sentido</div>
      <div style="font-size:15px;color:#a0a0c0;line-height:1.7;margin-bottom:24px">
        Você completou os 7 módulos do programa.<br>
        <strong style="color:#F7B731">Viktor Frankl estaria orgulhoso.</strong>
      </div>

      <div style="display:flex;gap:16px;justify-content:center;margin-bottom:28px;flex-wrap:wrap">
        <div style="background:rgba(247,183,49,0.1);border:1px solid rgba(247,183,49,0.3);border-radius:12px;padding:16px 20px">
          <div style="font-size:28px;font-weight:800;color:#F7B731">${achievements.totalXP}</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px">XP Total</div>
        </div>
        <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px 20px">
          <div style="font-size:28px;font-weight:800;color:#10B981">7/7</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px">Módulos</div>
        </div>
        <div style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.3);border-radius:12px;padding:16px 20px">
          <div style="font-size:28px;font-weight:800;color:#6C63FF">${Object.keys(achievements.unlocked).length}</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px">Conquistas</div>
        </div>
      </div>

      <div style="font-style:italic;font-size:14px;color:#c0c0e0;border-top:1px solid rgba(247,183,49,0.2);padding-top:20px;margin-bottom:28px;line-height:1.8">
        "A vida nunca deixa de ter sentido, mesmo nos momentos mais miseráveis."<br>
        <strong style="color:#F7B731">— Viktor Frankl</strong>
      </div>

      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button onclick="document.getElementById('program-celebration-overlay').remove()" style="
          background:transparent;color:#a0a0c0;border:1px solid rgba(255,255,255,0.1);
          border-radius:10px;padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;
        ">Fechar</button>
        <button onclick="document.getElementById('program-celebration-overlay').remove(); navigate('certificate')" style="
          background:linear-gradient(135deg,#F7B731,#FF6584);color:#fff;border:none;
          border-radius:10px;padding:10px 28px;font-size:14px;font-weight:800;cursor:pointer;
        ">🏆 Ver Certificado</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => launchConfetti('confetti-program'), 400);
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
}

function closeCelebration() {
  const el = document.getElementById('celebration-overlay');
  if (el) {
    el.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function launchConfetti(containerId = 'confetti-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const colors = ['#6C63FF', '#FF6584', '#F7B731', '#10B981', '#A855F7', '#43B89C', '#fff'];
  const shapes = ['●', '■', '▲', '★', '♦'];

  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 8 + Math.random() * 12;
    const startX = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 1.5 + Math.random() * 1.5;
    const rotation = Math.random() * 720 - 360;

    particle.style.cssText = `
      position: absolute;
      top: -20px;
      left: ${startX}%;
      font-size: ${size}px;
      color: ${color};
      animation: confettiFall ${duration}s ${delay}s ease-in forwards;
      transform-origin: center;
      pointer-events: none;
      z-index: 1;
    `;
    particle.textContent = shape;
    container.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000 + 100);
  }
}

// ── Render da tela de conquistas ─────────────────────────────────────────────
function renderAchievements() {
  const unlockedCount = Object.keys(achievements.unlocked).length;
  const totalCount = ACHIEVEMENTS_DATA.length;
  const totalXP = achievements.totalXP || 0;
  const streak = achievements.streak || 0;

  const el = document.getElementById('view-achievements');
  if (!el) return;

  // Agrupar por raridade
  const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

  el.innerHTML = `
    <!-- Stats header -->
    <div style="
      background:linear-gradient(135deg,rgba(108,99,255,0.12),rgba(247,183,49,0.08));
      border:1px solid rgba(108,99,255,0.2); border-radius:16px;
      padding:28px; margin-bottom:28px;
    ">
      <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:20px">🏆 Minhas Conquistas</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;flex:1;min-width:100px">
          <div style="font-size:28px;font-weight:800;color:#F7B731">${totalXP}</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">XP Total</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;flex:1;min-width:100px">
          <div style="font-size:28px;font-weight:800;color:#10B981">${unlockedCount}/${totalCount}</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">Desbloqueadas</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;flex:1;min-width:100px">
          <div style="font-size:28px;font-weight:800;color:#6C63FF">${streak}</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">Dias Seguidos</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;flex:1;min-width:100px">
          <div style="font-size:28px;font-weight:800;color:#A855F7">${Math.round((unlockedCount/totalCount)*100)}%</div>
          <div style="font-size:11px;color:#a0a0c0;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">Completado</div>
        </div>
      </div>
      <!-- Progress bar -->
      <div style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#a0a0c0;margin-bottom:6px">
          <span>Progresso das conquistas</span>
          <span>${unlockedCount}/${totalCount}</span>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:20px;height:8px;overflow:hidden">
          <div style="height:100%;background:linear-gradient(90deg,#6C63FF,#F7B731);border-radius:20px;width:${Math.round((unlockedCount/totalCount)*100)}%;transition:width 0.8s ease"></div>
        </div>
      </div>
    </div>

    <!-- Achievements by rarity -->
    ${rarityOrder.map(rarity => {
      const items = ACHIEVEMENTS_DATA.filter(a => a.rarity === rarity);
      const rc = RARITY_CONFIG[rarity];
      return `
        <div style="margin-bottom:28px">
          <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${rc.color};margin-bottom:14px;display:flex;align-items:center;gap:8px">
            <span style="width:24px;height:2px;background:${rc.color};display:inline-block;border-radius:2px"></span>
            ${rc.label}
            <span style="font-size:11px;color:#a0a0c0;font-weight:400;text-transform:none;letter-spacing:0">
              (${items.filter(a => achievements.unlocked[a.id]).length}/${items.length})
            </span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
            ${items.map(a => {
              const unlocked = achievements.unlocked[a.id];
              const unlockedDate = unlocked ? new Date(unlocked.unlockedAt).toLocaleDateString('pt-BR') : null;
              return `
                <div style="
                  background:${unlocked ? rc.bg : 'rgba(255,255,255,0.02)'};
                  border:1px solid ${unlocked ? rc.border : 'rgba(255,255,255,0.06)'};
                  border-radius:14px; padding:18px;
                  display:flex; align-items:flex-start; gap:14px;
                  transition:all 0.2s ease;
                  ${unlocked ? '' : 'opacity:0.45;filter:grayscale(0.8);'}
                ">
                  <div style="
                    font-size:32px; flex-shrink:0;
                    filter:${unlocked ? `drop-shadow(0 0 8px ${rc.color})` : 'none'};
                  ">${unlocked ? a.icon : '🔒'}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:14px;font-weight:700;color:${unlocked ? '#e8e8f0' : '#6060a0'};margin-bottom:4px">${a.title}</div>
                    <div style="font-size:12px;color:${unlocked ? '#a0a0c0' : '#404060'};line-height:1.5;margin-bottom:6px">${a.description}</div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                      <span style="font-size:11px;font-weight:700;color:${unlocked ? '#F7B731' : '#404060'}">+${a.xp} XP</span>
                      ${unlocked ? `<span style="font-size:10px;color:#6060a0">Desbloqueado em ${unlockedDate}</span>` : ''}
                    </div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('')}
  `;
}