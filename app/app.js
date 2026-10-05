// ===== STATE MANAGEMENT =====
const STATE_KEY = 'rsv_app_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : getDefaultState();
  } catch { return getDefaultState(); }
}

function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
  if (typeof checkAchievements === 'function') checkAchievements();
}

function getDefaultState() {
  return {
    userName: '',
    startDate: '',
    intention: '',
    currentView: 'dashboard',
    currentModule: null,
    thermometer: {},       // { 'pre': 5, 'mod1': 7, ... }
    moduleRatings: {},     // { 1: 7, 2: 8, ... }
    moduleStatus: {},      // { 1: 'active'|'done', ... }
    moduleDates: {},       // { 1: { start: '', end: '' } }
    exercises: {},         // { '1.1': { areas: {}, questions: {}, ... } }
    checklists: {},        // { 1: [true, false, ...] }
    weeklyDiary: {},       // { 1: { discovery: '', commitment: '', rating: 0 } }
    manifesto: {},         // { eu_sou: '', eu_acredito: '', ... }
    dailyPractices: {},    // { '5.3': { 'Mon': [true,false,...], ... } }
    valuesSelected: [],    // ['Amor', 'Liberdade', ...]
    valuesWhy: {},         // { 'Amor': 'porque...' }
    valuesAlignment: {},   // { 'Amor': 8, ... }
    ikigai: {},            // { love: '', good: '', world: '', paid: '', ikigai: '' }
    purposeStatement: '',
    goals90: [],           // [{ text: '', deadline: '' }, ...]
    timelineMoments: [],   // [{ year: '', text: '' }, ...]
    setupDone: false
  };
}

let state = loadState();

// ===== ROUTER =====
function navigate(view, moduleId) {
  state.currentView = view;
  if (moduleId !== undefined) state.currentModule = moduleId;
  saveState();
  render();
  window.scrollTo(0, 0);
}

// ===== HELPERS =====
function getModuleProgress(moduleId) {
  const checks = state.checklists[moduleId] || [];
  const total = PROGRAM_DATA.modules[moduleId - 1].checklist.length;
  const done = checks.filter(Boolean).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function getTotalProgress() {
  let totalDone = 0, totalItems = 0;
  PROGRAM_DATA.modules.forEach(m => {
    const p = getModuleProgress(m.id);
    totalDone += p.done;
    totalItems += p.total;
  });
  return { done: totalDone, total: totalItems, pct: totalItems ? Math.round((totalDone / totalItems) * 100) : 0 };
}

function getModuleStatus(moduleId) {
  return state.moduleStatus[moduleId] || (moduleId === 1 ? 'active' : 'locked');
}

function isModuleUnlocked(moduleId) {
  if (moduleId === 1) return true;
  const prev = getModuleProgress(moduleId - 1);
  return prev.pct >= 60 || state.moduleStatus[moduleId - 1] === 'done';
}

function getColorForValue(val, max = 10) {
  const pct = val / max;
  if (pct >= 0.8) return '#10B981';
  if (pct >= 0.6) return '#F7B731';
  if (pct >= 0.4) return '#6C63FF';
  return '#EF4444';
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ===== RENDER ENGINE =====
function render() {
  updateSidebar();
  updateTopbar();
  renderView();
}

function updateSidebar() {
  const prog = getTotalProgress();
  document.getElementById('sidebar-progress-fill').style.width = prog.pct + '%';
  document.getElementById('sidebar-progress-pct').textContent = prog.pct + '%';
  document.getElementById('sidebar-progress-done').textContent = `${prog.done}/${prog.total} tarefas`;

  // Update nav items
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === state.currentView &&
      (el.dataset.module === undefined || parseInt(el.dataset.module) === state.currentModule));
  });

  // Update module nav badges
  PROGRAM_DATA.modules.forEach(m => {
    const p = getModuleProgress(m.id);
    const badge = document.getElementById(`nav-badge-${m.id}`);
    const check = document.getElementById(`nav-check-${m.id}`);
    if (badge) badge.textContent = `${p.pct}%`;
    if (check) check.style.display = p.pct === 100 ? 'inline' : 'none';
  });

  // User name
  const nameEl = document.getElementById('sidebar-user-name');
  if (nameEl) nameEl.textContent = state.userName || 'Participante';
  const dateEl = document.getElementById('sidebar-user-date');
  if (dateEl) dateEl.textContent = state.startDate ? `Início: ${formatDate(state.startDate)}` : 'Configure seu perfil';
}

function updateTopbar() {
  const titles = {
    dashboard: { title: 'Painel Principal', sub: 'Visão geral da sua jornada' },
    module: { title: `Módulo ${state.currentModule} — ${state.currentModule ? PROGRAM_DATA.modules[state.currentModule - 1].title : ''}`, sub: state.currentModule ? PROGRAM_DATA.modules[state.currentModule - 1].week : '' },
    progress: { title: 'Meu Progresso', sub: 'Acompanhe sua evolução' },
    achievements: { title: 'Minhas Conquistas', sub: 'Celebre cada passo da sua jornada' },
    diary: { title: 'Diário Semanal', sub: 'Reflexões e descobertas' },
    manifesto: { title: 'Meu Manifesto de Vida', sub: 'Sua declaração pessoal de sentido' },
    certificate: { title: 'Certificado', sub: 'Conclusão do programa' }
  };
  const t = titles[state.currentView] || { title: 'Redescobrindo o Sentido da Vida', sub: '' };
  document.getElementById('topbar-title').textContent = t.title;
  document.getElementById('topbar-subtitle').textContent = t.sub;
}

function renderView() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewId = `view-${state.currentView}`;
  const viewEl = document.getElementById(viewId);
  if (viewEl) {
    viewEl.classList.add('active');
    const renderFn = {
      dashboard: renderDashboard,
      module: renderModuleView,
      progress: renderProgress,
      achievements: renderAchievements,
      diary: renderDiary,
      manifesto: renderManifesto,
      certificate: renderCertificate
    }[state.currentView];
    if (renderFn) renderFn();
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const prog = getTotalProgress();
  document.getElementById('dash-total-pct').textContent = prog.pct + '%';
  document.getElementById('dash-modules-done').textContent =
    Object.values(state.moduleStatus).filter(s => s === 'done').length;
  document.getElementById('dash-weeks-active').textContent =
    state.startDate ? Math.ceil((Date.now() - new Date(state.startDate)) / 86400000 / 7) : 0;

  // Thermometer pre
  const preVal = state.thermometer['pre'] || 0;
  document.getElementById('dash-pre-score').textContent = preVal || '—';

  // Render module cards
  const grid = document.getElementById('modules-grid');
  grid.innerHTML = PROGRAM_DATA.modules.map(m => {
    const p = getModuleProgress(m.id);
    const unlocked = isModuleUnlocked(m.id);
    const status = getModuleStatus(m.id);
    const statusLabel = p.pct === 100 ? 'done' : (unlocked ? 'active' : 'locked');
    const statusText = { done: '✓ Concluído', active: '▶ Em andamento', locked: '🔒 Bloqueado' }[statusLabel];
    return `
      <div class="module-card" style="--module-color:${m.color}" onclick="${unlocked ? `navigate('module',${m.id})` : `showToast('Complete o módulo anterior para desbloquear','info')`}">
        <div class="module-card-header">
          <div class="module-card-icon" style="background:${m.color}22">${m.icon}</div>
          <div class="module-card-meta">
            <div class="module-card-week">${m.week}</div>
            <div class="module-card-title">${m.title}</div>
            <div class="module-card-subtitle">${m.subtitle}</div>
          </div>
        </div>
        <div class="module-card-progress">
          <div class="module-card-progress-label">
            <span>Progresso</span>
            <span>${p.done}/${p.total} tarefas</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${p.pct}%;background:${m.color}"></div>
          </div>
        </div>
        <div class="module-card-status status-${statusLabel}">${statusText}</div>
      </div>`;
  }).join('');

  // Thermometer
  renderDailyQuoteWidget();
  renderThermometer();
}

function renderThermometer() {
  const container = document.getElementById('thermometer-grid');
  const moments = [
    { key: 'pre', label: 'Antes de iniciar (Pré)' },
    ...PROGRAM_DATA.modules.map(m => ({ key: `mod${m.id}`, label: `Após Módulo ${m.id}` }))
  ];
  container.innerHTML = moments.map(({ key, label }) => {
    const val = state.thermometer[key] || 0;
    return `
      <div class="thermo-item">
        <div class="thermo-item-label">${label}</div>
        <div class="thermo-rating">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
            <div class="thermo-dot ${val === n ? 'selected' : ''}"
              style="${val === n ? `background:${getColorForValue(n)};` : ''}"
              onclick="setThermometer('${key}',${n})">${n}</div>
          `).join('')}
        </div>
      </div>`;
  }).join('');
}

function setThermometer(key, val) {
  state.thermometer[key] = val;
  saveState();
  renderThermometer();
  if (key === 'pre') document.getElementById('dash-pre-score').textContent = val;
  showToast(`Pontuação registrada: ${val}/10`);
}

// ===== MODULE VIEW =====
function renderModuleView() {
  const m = PROGRAM_DATA.modules[state.currentModule - 1];
  if (!m) return;

  const container = document.getElementById('view-module');
  const p = getModuleProgress(m.id);

  // Header
  document.getElementById('mod-header').style.setProperty('--module-color', m.color);
  document.getElementById('mod-header').setAttribute('data-icon', m.icon);
  document.getElementById('mod-week').textContent = m.week;
  document.getElementById('mod-title').textContent = m.title;
  document.getElementById('mod-subtitle').textContent = m.subtitle;
  document.getElementById('mod-quote').textContent = `"${m.quote}"`;
  document.getElementById('mod-progress-fill').style.width = p.pct + '%';
  document.getElementById('mod-progress-fill').style.background = m.color;
  document.getElementById('mod-progress-text').textContent = `${p.pct}% concluído (${p.done}/${p.total} tarefas)`;

  // Concept
  renderConcept(m);

  // Exercises
  renderExercises(m);

  // Checklist
  renderChecklist(m);

  // Mark module as started
  if (!state.moduleDates[m.id]) state.moduleDates[m.id] = {};
  if (!state.moduleDates[m.id].start) {
    state.moduleDates[m.id].start = today();
    saveState();
  }
}

function renderConcept(m) {
  const el = document.getElementById('mod-concept');
  let html = `
    <div class="concept-box">
      <div class="concept-box-title">🧠 ${m.concept.title}</div>
      <div class="concept-box-text">${m.concept.text}</div>`;

  if (m.concept.signs) {
    html += `
      <div class="signs-grid">
        <div>
          <div class="signs-col-title">Sinais Internos</div>
          <ul class="signs-list">${m.concept.signs.internal.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="signs-col-title">Sinais Comportamentais</div>
          <ul class="signs-list">${m.concept.signs.behavioral.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>`;
  }
  html += '</div>';
  el.innerHTML = html;
}

function renderExercises(m) {
  const el = document.getElementById('mod-exercises');
  el.innerHTML = m.exercises.map((ex, idx) => {
    const isOpen = idx === 0;
    return `
      <div class="exercise-card ${isOpen ? 'open' : ''}" id="ex-card-${ex.id}">
        <div class="exercise-card-header" onclick="toggleExercise('${ex.id}')">
          <div class="exercise-number">${ex.id}</div>
          <div class="exercise-card-title">Exercício ${ex.id} — ${ex.title}</div>
          <div class="exercise-card-toggle">⌄</div>
        </div>
        <div class="exercise-card-body">
          <div class="exercise-description">${ex.description}</div>
          ${renderExerciseBody(ex, m)}
        </div>
      </div>`;
  }).join('');
}

function renderExerciseBody(ex, m) {
  const exData = state.exercises[ex.id] || {};

  switch (ex.type) {
    case 'rating_areas':
      return renderRatingAreas(ex, exData);
    case 'questions':
      return renderQuestions(ex, exData);
    case 'letter':
    case 'textarea':
      return renderTextarea(ex, exData);
    case 'timeline':
      return renderTimeline(ex, exData);
    case 'rewrite':
      return renderRewrite(ex, exData);
    case 'values_selection':
      return renderValuesSelection(ex);
    case 'values_alignment':
      return renderValuesAlignment(ex);
    case 'ikigai':
      return renderIkigai(ex, exData);
    case 'purpose_statement':
      return renderPurposeStatement(ex);
    case 'goals_90days':
      return renderGoals90(ex);
    case 'connections_map':
      return renderConnectionsMap(ex, exData);
    case 'daily_practices':
      return renderDailyPractices(ex);
    case 'integration':
      return renderIntegration(ex, exData);
    case 'final_rating':
      return renderFinalRating(ex, exData);
    default:
      return '<p class="text-muted text-sm">Exercício em desenvolvimento.</p>';
  }
}

function renderRatingAreas(ex, exData) {
  const areas = exData.areas || {};
  return `
    <div id="rating-areas-${ex.id}">
      ${ex.areas.map(area => {
        const val = areas[area] || 0;
        return `
          <div class="rating-area">
            <div class="rating-area-label">${area}</div>
            <div class="rating-dots">
              ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                <div class="rating-dot ${val === n ? 'selected' : ''}"
                  style="${val === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : ''}"
                  onclick="setRatingArea('${ex.id}','${area.replace(/'/g,"\\'")}',${n})">${n}</div>
              `).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>
    <button class="btn btn-primary mt-16" onclick="saveExercise('${ex.id}')">💾 Salvar Avaliação</button>`;
}

function renderQuestions(ex, exData) {
  const answers = exData.answers || {};
  return `
    <div>
      ${ex.questions.map((q, i) => `
        <div class="form-group">
          <label class="form-label">${q}</label>
          <textarea id="q-${ex.id}-${i}" placeholder="Escreva sua resposta aqui..." rows="3"
            onchange="setQuestionAnswer('${ex.id}',${i},this.value)">${answers[i] || ''}</textarea>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveExercise('${ex.id}')">💾 Salvar Respostas</button>
    </div>`;
}

function renderTextarea(ex, exData) {
  return `
    <div>
      <textarea id="ta-${ex.id}" placeholder="${ex.placeholder || 'Escreva aqui...'}" rows="6"
        onchange="setTextareaValue('${ex.id}',this.value)">${exData.text || ''}</textarea>
      <button class="btn btn-primary mt-16" onclick="saveExercise('${ex.id}')">💾 Salvar</button>
    </div>`;
}

function renderTimeline(ex, exData) {
  const moments = state.timelineMoments.length ? state.timelineMoments :
    Array.from({ length: ex.moments }, () => ({ year: '', text: '' }));
  if (!state.timelineMoments.length) state.timelineMoments = moments;

  return `
    <div id="timeline-${ex.id}">
      ${moments.map((m, i) => `
        <div class="timeline-item">
          <div class="timeline-item-header">
            <span class="timeline-item-num">Momento ${i + 1}</span>
            <input type="text" placeholder="Ano (ex: 2015)" value="${m.year || ''}"
              style="width:120px;display:inline-block"
              onchange="setTimelineYear(${i},this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">O que aconteceu e o que aprendi:</label>
            <textarea rows="3" placeholder="Descreva o momento e o aprendizado..."
              onchange="setTimelineText(${i},this.value)">${m.text || ''}</textarea>
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveTimeline('${ex.id}')">💾 Salvar Linha do Tempo</button>
    </div>`;
}

function renderRewrite(ex, exData) {
  const fields = exData.fields || {};
  return `
    <div>
      ${ex.fields.map((f, i) => `
        <div class="form-group">
          <label class="form-label">${f}</label>
          <textarea rows="3" placeholder="Escreva aqui..."
            onchange="setRewriteField('${ex.id}',${i},this.value)">${fields[i] || ''}</textarea>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveExercise('${ex.id}')">💾 Salvar</button>
    </div>`;
}

function renderValuesSelection(ex) {
  const selected = state.valuesSelected || [];
  const maxReached = selected.length >= 5;
  return `
    <div>
      <div class="values-grid" id="values-chips">
        ${ex.values.map(v => `
          <div class="value-chip ${selected.includes(v) ? 'selected' : ''} ${maxReached && !selected.includes(v) ? 'max-reached' : ''}"
            onclick="toggleValue('${v}')">${v}</div>
        `).join('')}
      </div>
      <div class="values-selected-list" id="values-selected-list">
        <div class="values-selected-title">Meus 5 Valores Essenciais (em ordem de importância)</div>
        ${selected.length === 0 ? '<p class="text-muted text-sm">Selecione até 5 valores acima.</p>' :
          selected.map((v, i) => `
            <div class="value-rank-item">
              <div class="value-rank-num">${i + 1}</div>
              <div class="value-rank-name">${v}</div>
              <div class="value-rank-why">
                <input type="text" placeholder="Por que este valor é importante para mim..."
                  value="${state.valuesWhy[v] || ''}"
                  onchange="setValueWhy('${v}',this.value)">
              </div>
            </div>
          `).join('')}
        }
      </div>
      <button class="btn btn-primary mt-16" onclick="saveValues()">💾 Salvar Valores</button>
    </div>`;
}

function renderValuesAlignment(ex) {
  const selected = state.valuesSelected || [];
  if (selected.length === 0) {
    return '<div class="empty-state"><div class="empty-state-icon">💎</div><div class="empty-state-title">Complete o Exercício 3.1 primeiro</div><div class="empty-state-text">Selecione seus valores essenciais para avaliar o alinhamento.</div></div>';
  }
  const alignment = state.valuesAlignment || {};
  return `
    <div id="values-alignment">
      ${selected.map(v => {
        const val = alignment[v] || 0;
        return `
          <div class="rating-area">
            <div class="rating-area-label">${v}</div>
            <div class="rating-dots">
              ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                <div class="rating-dot ${val === n ? 'selected' : ''}"
                  style="${val === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : ''}"
                  onclick="setValueAlignment('${v}',${n})">${n}</div>
              `).join('')}
            </div>
          </div>`;
      }).join('')}
      <button class="btn btn-primary mt-16" onclick="saveValuesAlignment()">💾 Salvar Alinhamento</button>
    </div>`;
}

function renderIkigai(ex, exData) {
  const ikigai = state.ikigai || {};
  const dims = ex.dimensions;
  return `
    <div>
      <div class="ikigai-grid">
        ${dims.slice(0, 4).map(d => `
          <div class="ikigai-item">
            <div class="ikigai-item-header">
              <span class="ikigai-item-icon">${d.icon}</span>
              <div>
                <div class="ikigai-item-label">${d.label}</div>
                <div class="ikigai-item-desc">${d.description}</div>
              </div>
            </div>
            <textarea rows="3" placeholder="Escreva aqui..."
              onchange="setIkigai('${d.key}',this.value)">${ikigai[d.key] || ''}</textarea>
          </div>
        `).join('')}
        <div class="ikigai-intersection">
          <div class="ikigai-item-header">
            <span class="ikigai-item-icon">${dims[4].icon}</span>
            <div>
              <div class="ikigai-item-label" style="color:var(--gold)">${dims[4].label}</div>
              <div class="ikigai-item-desc">${dims[4].description}</div>
            </div>
          </div>
          <textarea rows="3" placeholder="Onde suas quatro dimensões se encontram..."
            onchange="setIkigai('ikigai',this.value)">${ikigai['ikigai'] || ''}</textarea>
        </div>
      </div>
      <button class="btn btn-primary" onclick="saveIkigai('${ex.id}')">💾 Salvar Ikigai</button>
    </div>`;
}

function renderPurposeStatement(ex) {
  return `
    <div>
      <div class="concept-box" style="margin-bottom:16px">
        <div class="concept-box-title">💡 Exemplos de Declarações de Propósito</div>
        ${ex.examples.map(e => `<div class="concept-box-text" style="margin-bottom:8px">• ${e}</div>`).join('')}
      </div>
      <div class="form-group">
        <label class="form-label">Minha Declaração de Propósito Pessoal:</label>
        <textarea rows="3" placeholder="Meu propósito é [VERBO DE AÇÃO] + [QUEM] + [PARA QUÊ]..."
          onchange="setPurposeStatement(this.value)">${state.purposeStatement || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Como esse propósito se manifesta (ou pode se manifestar) no meu dia a dia?</label>
        <textarea rows="3" placeholder="Escreva como seu propósito aparece nas suas ações cotidianas..."
          onchange="setPurposeManifestation(this.value)">${(state.exercises['4.2'] || {}).manifestation || ''}</textarea>
      </div>
      <button class="btn btn-primary" onclick="savePurpose()">💾 Salvar Propósito</button>
    </div>`;
}

function renderGoals90(ex) {
  const goals = state.goals90.length ? state.goals90 : Array.from({ length: ex.count }, () => ({ text: '', deadline: '' }));
  if (!state.goals90.length) state.goals90 = goals;
  return `
    <div id="goals-90">
      ${goals.map((g, i) => `
        <div class="form-group" style="background:var(--bg3);border-radius:var(--radius-sm);padding:16px;margin-bottom:12px">
          <label class="form-label">Meta ${i + 1}</label>
          <textarea rows="2" placeholder="Descreva sua meta concreta..."
            onchange="setGoal(${i},'text',this.value)">${g.text || ''}</textarea>
          <div style="display:flex;align-items:center;gap:12px;margin-top:10px">
            <label class="form-label" style="margin:0;white-space:nowrap">Prazo:</label>
            <input type="date" value="${g.deadline || ''}" onchange="setGoal(${i},'deadline',this.value)">
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveGoals()">💾 Salvar Metas</button>
    </div>`;
}

function renderConnectionsMap(ex, exData) {
  const answers = exData.answers || {};
  return `
    <div>
      ${ex.questions.map((q, i) => `
        <div class="form-group">
          <label class="form-label">${q}</label>
          <textarea rows="3" placeholder="Escreva aqui..."
            onchange="setQuestionAnswer('${ex.id}',${i},this.value)">${answers[i] || ''}</textarea>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveExercise('${ex.id}')">💾 Salvar</button>
    </div>`;
}

function renderDailyPractices(ex) {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const data = state.dailyPractices[ex.id] || {};

  return `
    <div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:500px">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text3);font-weight:700;border-bottom:1px solid var(--border)">Prática</th>
              ${days.map(d => `<th style="text-align:center;padding:8px;font-size:11px;color:var(--text3);font-weight:700;border-bottom:1px solid var(--border)">${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${ex.practices.map((p, pi) => {
              const practiceData = data[pi] || {};
              return `
                <tr>
                  <td style="padding:10px 12px;font-size:13px;color:var(--text2);border-bottom:1px solid var(--border)">${p}</td>
                  ${days.map((d, di) => `
                    <td style="text-align:center;border-bottom:1px solid var(--border);padding:6px">
                      <div class="practice-check ${practiceData[di] ? 'checked' : ''}"
                        onclick="togglePractice('${ex.id}',${pi},${di})">
                        ${practiceData[di] ? '✓' : ''}
                      </div>
                    </td>
                  `).join('')}
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="form-group mt-16">
        <label class="form-label">Minha reflexão sobre a prática de autotranscendência desta semana:</label>
        <textarea rows="3" placeholder="Como foi praticar a autotranscendência esta semana?"
          onchange="setPracticeReflection('${ex.id}',this.value)">${(state.exercises[ex.id] || {}).reflection || ''}</textarea>
      </div>
      <button class="btn btn-primary mt-8" onclick="savePractices('${ex.id}')">💾 Salvar Práticas</button>
    </div>`;
}

function renderIntegration(ex, exData) {
  const answers = exData.answers || {};
  return `
    <div>
      ${ex.modules.map((label, i) => `
        <div class="form-group">
          <label class="form-label">${label}</label>
          <textarea rows="2" placeholder="Escreva sua síntese..."
            onchange="setQuestionAnswer('${ex.id}',${i},this.value)">${answers[i] || ''}</textarea>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveExercise('${ex.id}')">💾 Salvar Integração</button>
    </div>`;
}

function renderFinalRating(ex, exData) {
  const areas = exData.areas || {};
  const initialAreas = (state.exercises['1.1'] || {}).areas || {};
  return `
    <div id="final-rating-${ex.id}">
      <div style="background:var(--bg3);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px;font-size:13px;color:var(--text3)">
        💡 Compare com sua avaliação inicial no Módulo 1
      </div>
      ${ex.areas.map(area => {
        const initial = initialAreas[area] || 0;
        const current = areas[area] || 0;
        const diff = current - initial;
        const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '=';
        const diffColor = diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--danger)' : 'var(--text3)';
        return `
          <div class="rating-area" data-area="${area}">
            <div class="rating-area-label">
              ${area}
              ${initial > 0 ? `<span class="final-rating-comparison" style="font-size:11px;color:${diffColor};margin-left:8px">${diffStr} (era ${initial})</span>` : ''}
            </div>
            <div class="rating-dots">
              ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                <div class="rating-dot ${current === n ? 'selected' : ''}"
                  style="${current === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : ''}"
                  onclick="setFinalRating('${ex.id}','${area.replace(/'/g,"\\'")}',${n})">${n}</div>
              `).join('')}
            </div>
          </div>`;
      }).join('')}
      <div class="form-group mt-16">
        <label class="form-label">O que mudou em mim ao longo deste programa?</label>
        <textarea rows="4" placeholder="Reflita sobre sua transformação..."
          onchange="setFinalReflection('${ex.id}',this.value)">${exData.reflection || ''}</textarea>
      </div>
      <button class="btn btn-primary" onclick="saveFinalRating('${ex.id}')">💾 Salvar Avaliação Final</button>
    </div>`;
}

function renderChecklist(m) {
  const checks = state.checklists[m.id] || Array(m.checklist.length).fill(false);
  const el = document.getElementById('mod-checklist');
  el.innerHTML = `
    <div class="checklist-section">
      <div class="checklist-title">✅ Checklist de Conclusão — Módulo ${m.id}</div>
      ${m.checklist.map((item, i) => `
        <div class="checklist-item ${checks[i] ? 'checked' : ''}" onclick="toggleChecklist(${m.id},${i})">
          <div class="checklist-checkbox">${checks[i] ? '✓' : ''}</div>
          <div class="checklist-item-text">${item}</div>
        </div>
      `).join('')}
    </div>`;
}

// ===== PROGRESS VIEW =====
function renderProgress() {
  const prog = getTotalProgress();
  document.getElementById('prog-total-pct').textContent = prog.pct + '%';
  document.getElementById('prog-modules-done').textContent =
    Object.values(state.moduleStatus).filter(s => s === 'done').length + '/7';
  document.getElementById('prog-checklist-done').textContent = `${prog.done}/${prog.total}`;

  // Module progress bars
  const barsEl = document.getElementById('prog-module-bars');
  barsEl.innerHTML = PROGRAM_DATA.modules.map(m => {
    const p = getModuleProgress(m.id);
    const dates = state.moduleDates[m.id] || {};
    return `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:20px">${m.icon}</span>
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--text)">${m.title}</div>
              <div style="font-size:11px;color:var(--text3)">${m.week}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:20px;font-weight:800;color:${m.color}">${p.pct}%</div>
            <div style="font-size:11px;color:var(--text3)">${p.done}/${p.total} tarefas</div>
          </div>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${p.pct}%;background:${m.color}"></div>
        </div>
        ${dates.start ? `<div style="font-size:11px;color:var(--text3);margin-top:8px">Início: ${formatDate(dates.start)}${dates.end ? ` · Conclusão: ${formatDate(dates.end)}` : ''}</div>` : ''}
      </div>`;
  }).join('');

  // Evolution chart
  renderEvolutionChart();
}

function renderEvolutionChart() {
  const el = document.getElementById('evolution-chart');
  const moments = [
    { key: 'pre', label: 'Pré' },
    ...PROGRAM_DATA.modules.map(m => ({ key: `mod${m.id}`, label: `M${m.id}` }))
  ];
  const maxVal = 10;
  el.innerHTML = `
    <div class="chart-bars">
      ${moments.map(({ key, label }) => {
        const val = state.thermometer[key] || 0;
        const pct = (val / maxVal) * 100;
        const color = val ? getColorForValue(val) : 'var(--bg3)';
        return `
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="height:${pct}%;background:${color}">
              ${val ? `<div class="chart-bar-value">${val}</div>` : ''}
            </div>
            <div class="chart-bar-label">${label}</div>
          </div>`;
      }).join('')}
    </div>`;
}

// ===== DIARY VIEW =====
function renderDiary() {
  const el = document.getElementById('diary-cards');
  el.innerHTML = PROGRAM_DATA.modules.map(m => {
    const diary = state.weeklyDiary[m.id] || {};
    const unlocked = isModuleUnlocked(m.id);
    return `
      <div class="diary-card ${!unlocked ? 'opacity-50' : ''}">
        <div class="diary-card-header">
          <span class="diary-week-badge">${m.week}</span>
          <div>
            <div class="diary-module-name">${m.icon} ${m.title}</div>
          </div>
        </div>
        ${!unlocked ? '<p class="text-muted text-sm">Complete o módulo anterior para desbloquear.</p>' : `
          <div class="form-group">
            <label class="form-label">Principal descoberta desta semana:</label>
            <textarea rows="2" placeholder="O que descobri sobre mim mesmo(a)..."
              onchange="setDiary(${m.id},'discovery',this.value)">${diary.discovery || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Meu compromisso de ação para a próxima semana:</label>
            <textarea rows="2" placeholder="O que vou fazer diferente..."
              onchange="setDiary(${m.id},'commitment',this.value)">${diary.commitment || ''}</textarea>
          </div>
          <div class="diary-rating-row">
            <span class="diary-rating-label">Minha nota desta semana:</span>
            <div class="rating-dots">
              ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                <div class="rating-dot ${diary.rating === n ? 'selected' : ''}"
                  style="${diary.rating === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : ''}"
                  onclick="setDiaryRating(${m.id},${n})">${n}</div>
              `).join('')}
            </div>
          </div>
          <button class="btn btn-primary mt-16" onclick="saveDiary(${m.id})">💾 Salvar Reflexão</button>
        `}
      </div>`;
  }).join('');
}

// ===== MANIFESTO VIEW =====
function renderManifesto() {
  const manifesto = state.manifesto || {};
  const el = document.getElementById('manifesto-content');
  el.innerHTML = `
    <div class="manifesto-section">
      <div class="manifesto-intro">${PROGRAM_DATA.manifesto.description}</div>
      ${PROGRAM_DATA.manifesto.sections.map(s => `
        <div class="manifesto-item">
          <div class="manifesto-item-label">${s.label}</div>
          <textarea rows="4" placeholder="${s.placeholder}"
            onchange="setManifesto('${s.key}',this.value)">${manifesto[s.key] || ''}</textarea>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="saveManifesto()">💾 Salvar Manifesto</button>
    </div>
    ${Object.values(manifesto).some(v => v) ? `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;margin-top:24px">
        <div style="font-size:16px;font-weight:700;margin-bottom:20px;color:var(--gold)">✨ Prévia do Manifesto</div>
        ${PROGRAM_DATA.manifesto.sections.map(s => manifesto[s.key] ? `
          <div style="margin-bottom:20px">
            <div style="font-size:13px;font-weight:700;color:var(--accent2);margin-bottom:6px">${s.label}</div>
            <div style="font-size:15px;color:var(--text);line-height:1.8;white-space:pre-wrap">${manifesto[s.key]}</div>
          </div>
        ` : '').join('')}
      </div>
    ` : ''}`;
}

// ===== CERTIFICATE VIEW =====
function renderCertificate() {
  const prog = getTotalProgress();
  const allDone = prog.pct === 100;
  const el = document.getElementById('certificate-content');

  if (!allDone) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏆</div>
        <div class="empty-state-title">Complete todos os módulos para receber seu certificado</div>
        <div class="empty-state-text">Você completou ${prog.pct}% do programa. Continue sua jornada!</div>
        <div style="margin-top:24px">
          <div class="progress-bar-wrap" style="max-width:300px;margin:0 auto;height:10px">
            <div class="progress-bar-fill" style="width:${prog.pct}%"></div>
          </div>
          <div style="font-size:13px;color:var(--text3);margin-top:8px">${prog.done}/${prog.total} tarefas concluídas</div>
        </div>
        <button class="btn btn-primary mt-24" onclick="navigate('dashboard')">Continuar Jornada</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="certificate">
      <div class="certificate-stars">✦ ✦ ✦</div>
      <div class="certificate-title">Certificado de Conclusão</div>
      <div style="font-size:15px;color:var(--text3);margin-bottom:8px">Redescobrindo o Sentido da Vida</div>
      <div class="certificate-name">${state.userName || 'Participante'}</div>
      <div class="certificate-text">
        Certificamos que concluiu com dedicação e coragem a jornada completa de
        <strong>7 Semanas de Autodescoberta Existencial</strong>, explorando os fundamentos da
        Logoterapia, Psicologia Positiva, Neurociência e Terapia Existencial.
      </div>
      <div class="certificate-modules">
        ${PROGRAM_DATA.modules.map(m => `<span class="certificate-module-badge">✦ ${m.title}</span>`).join('')}
        <span class="certificate-module-badge">✦ Manifesto de Vida Pessoal</span>
      </div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:16px">
        Data de conclusão: ${formatDate(today())}
      </div>
      <div class="certificate-quote">
        "A vida nunca deixa de ter sentido, mesmo nos momentos mais miseráveis."<br>
        <strong>— Viktor Frankl</strong>
      </div>
    </div>
    <div style="text-align:center;margin-top:20px">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Certificado</button>
    </div>`;
}

// ===== EXERCISE ACTIONS =====
function toggleExercise(id) {
  const card = document.getElementById(`ex-card-${id}`);
  if (card) card.classList.toggle('open');
}

function setRatingArea(exId, area, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  if (!state.exercises[exId].areas) state.exercises[exId].areas = {};
  state.exercises[exId].areas[area] = val;
  saveState();
  // Re-render just the dots
  const container = document.getElementById(`rating-areas-${exId}`);
  if (container) {
    container.querySelectorAll('.rating-area').forEach(row => {
      const label = row.querySelector('.rating-area-label').textContent;
      if (label === area) {
        row.querySelectorAll('.rating-dot').forEach((dot, i) => {
          const n = i + 1;
          dot.className = `rating-dot ${val === n ? 'selected' : ''}`;
          dot.style.cssText = val === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : '';
        });
      }
    });
  }
}

function setQuestionAnswer(exId, idx, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  if (!state.exercises[exId].answers) state.exercises[exId].answers = {};
  state.exercises[exId].answers[idx] = val;
  saveState();
}

function setTextareaValue(exId, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  state.exercises[exId].text = val;
  saveState();
}

function setRewriteField(exId, idx, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  if (!state.exercises[exId].fields) state.exercises[exId].fields = {};
  state.exercises[exId].fields[idx] = val;
  saveState();
}

function setTimelineYear(idx, val) {
  if (!state.timelineMoments[idx]) state.timelineMoments[idx] = {};
  state.timelineMoments[idx].year = val;
  saveState();
}

function setTimelineText(idx, val) {
  if (!state.timelineMoments[idx]) state.timelineMoments[idx] = {};
  state.timelineMoments[idx].text = val;
  saveState();
}

function toggleValue(v) {
  const selected = state.valuesSelected || [];
  const idx = selected.indexOf(v);
  if (idx >= 0) {
    selected.splice(idx, 1);
  } else if (selected.length < 5) {
    selected.push(v);
  } else {
    showToast('Você já selecionou 5 valores. Remova um para adicionar outro.', 'info');
    return;
  }
  state.valuesSelected = selected;
  saveState();
  // Re-render values section
  const m = PROGRAM_DATA.modules[2];
  const ex = m.exercises.find(e => e.type === 'values_selection');
  const card = document.getElementById(`ex-card-${ex.id}`);
  if (card) {
    const body = card.querySelector('.exercise-card-body');
    if (body) {
      const desc = body.querySelector('.exercise-description');
      const newContent = renderValuesSelection(ex);
      body.innerHTML = (desc ? desc.outerHTML : '') + newContent;
    }
  }
}

function setValueWhy(v, val) {
  if (!state.valuesWhy) state.valuesWhy = {};
  state.valuesWhy[v] = val;
  saveState();
}

function setValueAlignment(v, val) {
  if (!state.valuesAlignment) state.valuesAlignment = {};
  state.valuesAlignment[v] = val;
  saveState();
  // Re-render alignment dots
  const container = document.getElementById('values-alignment');
  if (container) {
    container.querySelectorAll('.rating-area').forEach(row => {
      const label = row.querySelector('.rating-area-label').textContent.trim();
      if (label === v) {
        row.querySelectorAll('.rating-dot').forEach((dot, i) => {
          const n = i + 1;
          dot.className = `rating-dot ${val === n ? 'selected' : ''}`;
          dot.style.cssText = val === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : '';
        });
      }
    });
  }
}

function setIkigai(key, val) {
  if (!state.ikigai) state.ikigai = {};
  state.ikigai[key] = val;
  saveState();
}

function setPurposeStatement(val) {
  state.purposeStatement = val;
  saveState();
}

function setPurposeManifestation(val) {
  if (!state.exercises['4.2']) state.exercises['4.2'] = {};
  state.exercises['4.2'].manifestation = val;
  saveState();
}

function setGoal(idx, field, val) {
  if (!state.goals90[idx]) state.goals90[idx] = {};
  state.goals90[idx][field] = val;
  saveState();
}

function togglePractice(exId, practiceIdx, dayIdx) {
  if (!state.dailyPractices[exId]) state.dailyPractices[exId] = {};
  if (!state.dailyPractices[exId][practiceIdx]) state.dailyPractices[exId][practiceIdx] = {};
  state.dailyPractices[exId][practiceIdx][dayIdx] = !state.dailyPractices[exId][practiceIdx][dayIdx];
  saveState();
  const checks = document.querySelectorAll(`[onclick="togglePractice('${exId}',${practiceIdx},${dayIdx})"]`);
  checks.forEach(el => {
    el.classList.toggle('checked', state.dailyPractices[exId][practiceIdx][dayIdx]);
    el.textContent = state.dailyPractices[exId][practiceIdx][dayIdx] ? '✓' : '';
  });
}

function setPracticeReflection(exId, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  state.exercises[exId].reflection = val;
  saveState();
}

function setFinalRating(exId, area, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  if (!state.exercises[exId].areas) state.exercises[exId].areas = {};
  state.exercises[exId].areas[area] = val;
  saveState();
  const container = document.getElementById(`final-rating-${exId}`);
  const row = container && Array.from(container.querySelectorAll('.rating-area'))
    .find(item => item.dataset.area === area);
  if (!row) return;

  row.querySelectorAll('.rating-dot').forEach((dot, i) => {
    const selected = val === i + 1;
    dot.className = selected ? 'rating-dot selected' : 'rating-dot';
    dot.style.cssText = selected
      ? `background:${getColorForValue(val)};border-color:${getColorForValue(val)};color:#fff;`
      : '';
  });

  const initial = ((state.exercises['1.1'] || {}).areas || {})[area] || 0;
  const comparison = row.querySelector('.final-rating-comparison');
  if (comparison && initial > 0) {
    const diff = val - initial;
    comparison.textContent = `${diff > 0 ? '+' : diff < 0 ? '' : '='}${diff} (era ${initial})`;
    comparison.style.color = diff > 0
      ? 'var(--success)'
      : diff < 0 ? 'var(--danger)' : 'var(--text3)';
  }
}

function setFinalReflection(exId, val) {
  if (!state.exercises[exId]) state.exercises[exId] = {};
  state.exercises[exId].reflection = val;
  saveState();
}

function setDiary(moduleId, field, val) {
  if (!state.weeklyDiary[moduleId]) state.weeklyDiary[moduleId] = {};
  state.weeklyDiary[moduleId][field] = val;
  saveState();
}

function setDiaryRating(moduleId, val) {
  if (!state.weeklyDiary[moduleId]) state.weeklyDiary[moduleId] = {};
  state.weeklyDiary[moduleId].rating = val;
  saveState();
  // Update dots
  const diaryCard = document.querySelectorAll('.diary-card')[moduleId - 1];
  if (diaryCard) {
    diaryCard.querySelectorAll('.rating-dot').forEach((dot, i) => {
      const n = i + 1;
      dot.className = `rating-dot ${val === n ? 'selected' : ''}`;
      dot.style.cssText = val === n ? `background:${getColorForValue(n)};border-color:${getColorForValue(n)};color:#fff;` : '';
    });
  }
}

function setManifesto(key, val) {
  if (!state.manifesto) state.manifesto = {};
  state.manifesto[key] = val;
  saveState();
}

// ===== SAVE ACTIONS =====
function saveExercise(exId) {
  saveState();
  showToast('Exercício salvo com sucesso! ✓');
}

function saveTimeline(exId) {
  saveState();
  showToast('Linha do tempo salva! ✓');
}

function saveValues() {
  saveState();
  showToast('Valores essenciais salvos! ✓');
}

function saveValuesAlignment() {
  saveState();
  showToast('Alinhamento de valores salvo! ✓');
}

function saveIkigai(exId) {
  saveState();
  showToast('Ikigai salvo! ✓');
}

function savePurpose() {
  saveState();
  showToast('Declaração de propósito salva! ✓');
}

function saveGoals() {
  saveState();
  showToast('Metas salvas! ✓');
}

function savePractices(exId) {
  saveState();
  showToast('Práticas diárias salvas! ✓');
}

function saveDiary(moduleId) {
  saveState();
  showToast(`Reflexão da Semana ${moduleId} salva! ✓`);
}

function saveManifesto() {
  saveState();
  showToast('Manifesto de Vida salvo! ✓');
}

function saveFinalRating(exId) {
  saveState();
  showToast('Avaliação final salva! ✓');
}

// ===== CHECKLIST =====
function toggleChecklist(moduleId, idx) {
  if (!state.checklists[moduleId]) {
    state.checklists[moduleId] = Array(PROGRAM_DATA.modules[moduleId - 1].checklist.length).fill(false);
  }
  state.checklists[moduleId][idx] = !state.checklists[moduleId][idx];

  // Check if module is complete
  const allDone = state.checklists[moduleId].every(Boolean);
  if (allDone) {
    state.moduleStatus[moduleId] = 'done';
    if (!state.moduleDates[moduleId]) state.moduleDates[moduleId] = {};
    state.moduleDates[moduleId].end = today();
    // Unlock next module
    if (moduleId < 7) {
      if (!state.moduleStatus[moduleId + 1]) state.moduleStatus[moduleId + 1] = 'active';
    }
    showToast(`🎉 Módulo ${moduleId} concluído! Próximo módulo desbloqueado.`);
  }

  saveState();
  renderChecklist(PROGRAM_DATA.modules[moduleId - 1]);
  updateSidebar();
}

// ===== SETUP MODAL =====
function openSetupModal() {
  document.getElementById('setup-modal').classList.add('open');
}

function closeSetupModal() {
  document.getElementById('setup-modal').classList.remove('open');
}

function resetJourney() {
  const confirmed = window.confirm(
    'Isso apagará seu perfil, respostas, progresso, práticas, conquistas e XP deste dispositivo. Esta ação não pode ser desfeita. Deseja reiniciar a jornada?'
  );
  if (!confirmed) return;

  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch (error) {
    showToast('Não foi possível apagar os dados da jornada. Tente novamente.', 'info');
    console.error('Falha ao reiniciar a jornada:', error);
    return;
  }

  state = getDefaultState();
  achievements = loadAchievements();
  document.getElementById('setup-name').value = '';
  document.getElementById('setup-date').value = '';
  document.getElementById('setup-intention').value = '';
  render();
  showToast('Jornada reiniciada. Configure seu perfil para começar de novo.');
}

function saveSetup() {
  const name = document.getElementById('setup-name').value.trim();
  const date = document.getElementById('setup-date').value;
  const intention = document.getElementById('setup-intention').value.trim();
  if (!name) { showToast('Por favor, insira seu nome.', 'info'); return; }
  state.userName = name;
  state.startDate = date || today();
  state.intention = intention;
  state.setupDone = true;
  if (!state.moduleStatus[1]) state.moduleStatus[1] = 'active';
  saveState();
  closeSetupModal();
  render();
  showToast(`Bem-vindo(a), ${name}! Sua jornada começa agora. 🌟`);
}

// ===== SIDEBAR TOGGLE (MOBILE) =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

// ===== INIT =====
function init() {
  // Build sidebar nav
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = `
    <div class="sidebar-section-label">Principal</div>
    <div class="nav-item ${state.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard" onclick="navigate('dashboard')">
      <span class="nav-item-icon">🏠</span>
      <span class="nav-item-text">Painel</span>
    </div>
    <div class="nav-item ${state.currentView === 'progress' ? 'active' : ''}" data-view="progress" onclick="navigate('progress')">
      <span class="nav-item-icon">📊</span>
      <span class="nav-item-text">Meu Progresso</span>
    </div>
    <div class="nav-item ${state.currentView === 'achievements' ? 'active' : ''}" data-view="achievements" onclick="navigate('achievements')">
      <span class="nav-item-icon">🏆</span>
      <span class="nav-item-text">Conquistas</span>
    </div>
    <div class="nav-item ${state.currentView === 'diary' ? 'active' : ''}" data-view="diary" onclick="navigate('diary')">
      <span class="nav-item-icon">📔</span>
      <span class="nav-item-text">Diário Semanal</span>
    </div>
    <div class="nav-item ${state.currentView === 'manifesto' ? 'active' : ''}" data-view="manifesto" onclick="navigate('manifesto')">
      <span class="nav-item-icon">✍️</span>
      <span class="nav-item-text">Manifesto de Vida</span>
    </div>
    <div class="nav-item ${state.currentView === 'certificate' ? 'active' : ''}" data-view="certificate" onclick="navigate('certificate')">
      <span class="nav-item-icon">🏆</span>
      <span class="nav-item-text">Certificado</span>
    </div>
    <div class="sidebar-section-label">Módulos</div>
    ${PROGRAM_DATA.modules.map(m => {
      const p = getModuleProgress(m.id);
      const unlocked = isModuleUnlocked(m.id);
      return `
        <div class="nav-item ${state.currentView === 'module' && state.currentModule === m.id ? 'active' : ''} ${!unlocked ? 'opacity-50' : ''}"
          data-view="module" data-module="${m.id}"
          onclick="${unlocked ? `navigate('module',${m.id})` : `showToast('Complete o módulo anterior para desbloquear','info')`}">
          <span class="nav-item-icon">${m.icon}</span>
          <span class="nav-item-text">${m.title}</span>
          <span class="nav-item-badge" id="nav-badge-${m.id}">${p.pct}%</span>
          <span class="nav-item-check" id="nav-check-${m.id}" style="display:${p.pct === 100 ? 'inline' : 'none'}">✓</span>
        </div>`;
    }).join('')}`;

  // Auto-open setup if not done
  if (!state.setupDone) {
    setTimeout(openSetupModal, 500);
  }

  render();
  if (typeof checkAchievements === 'function') checkAchievements();
}

document.addEventListener('DOMContentLoaded', init);