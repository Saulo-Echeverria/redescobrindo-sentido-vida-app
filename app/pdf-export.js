// ===== PDF EXPORT ENGINE =====
// Gera um relatório completo em PDF usando apenas APIs nativas do navegador
// (window.print com estilos @media print dedicados — sem dependências externas)

function generatePDFReport() {
  const prog = getTotalProgress();
  const userName = state.userName || 'Participante';
  const startDate = state.startDate ? formatDate(state.startDate) : '—';
  const today_str = formatDate(new Date().toISOString().split('T')[0]);

  // ── helpers locais ──────────────────────────────────────────────────────────
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  function scoreBar(val, max = 10, color = '#6C63FF') {
    const pct = Math.round((val / max) * 100);
    const barColor = val >= 8 ? '#10B981' : val >= 6 ? '#F7B731' : val >= 4 ? '#6C63FF' : '#EF4444';
    return `
      <div class="score-bar-wrap">
        <div class="score-bar-fill" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <span class="score-label">${val}/10</span>`;
  }

  function sectionHeader(icon, title, color = '#6C63FF') {
    return `<div class="pdf-section-header" style="border-left-color:${color}">
      <span class="pdf-section-icon">${icon}</span>
      <span class="pdf-section-title">${title}</span>
    </div>`;
  }

  function answerBlock(label, value) {
    if (!value || String(value).trim() === '') return '';
    return `<div class="answer-block">
      <div class="answer-label">${esc(label)}</div>
      <div class="answer-text">${esc(value)}</div>
    </div>`;
  }

  function emptyNote(msg) {
    return `<div class="empty-note">${msg}</div>`;
  }

  // ── CAPA ────────────────────────────────────────────────────────────────────
  function buildCover() {
    const modulesDone = Object.values(state.moduleStatus).filter(s => s === 'done').length;
    const preScore = state.thermometer['pre'] || 0;
    const finalScore = state.thermometer['mod7'] || state.thermometer['mod6'] ||
                       state.thermometer['mod5'] || 0;
    const evolution = finalScore && preScore ? (finalScore > preScore ? `+${finalScore - preScore}` :
                      finalScore < preScore ? `${finalScore - preScore}` : '=') : '—';

    return `
    <div class="pdf-cover page-break-after">
      <div class="cover-ornament">✦ ✦ ✦</div>
      <div class="cover-program">REDESCOBRINDO O SENTIDO DA VIDA</div>
      <div class="cover-subtitle">Relatório Completo de Progresso</div>
      <div class="cover-name">${esc(userName)}</div>
      <div class="cover-meta">
        <span>Início: ${startDate}</span>
        <span class="cover-dot">·</span>
        <span>Gerado em: ${today_str}</span>
      </div>
      <div class="cover-stats">
        <div class="cover-stat">
          <div class="cover-stat-value">${prog.pct}%</div>
          <div class="cover-stat-label">Progresso Total</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-value">${modulesDone}/7</div>
          <div class="cover-stat-label">Módulos Concluídos</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-value">${prog.done}/${prog.total}</div>
          <div class="cover-stat-label">Tarefas Concluídas</div>
        </div>
        <div class="cover-stat">
          <div class="cover-stat-value">${evolution}</div>
          <div class="cover-stat-label">Evolução do Sentido</div>
        </div>
      </div>
      <div class="cover-quote">
        "A última das liberdades humanas é a de escolher a própria atitude<br>
        em qualquer conjunto de circunstâncias."
      </div>
      <div class="cover-author">— Viktor Frankl</div>
      <div class="cover-footer">
        Baseado na Logoterapia de Viktor Frankl · Psicologia Positiva · Neurociência · TCC
      </div>
    </div>`;
  }

  // ── SUMÁRIO ─────────────────────────────────────────────────────────────────
  function buildSummary() {
    const sections = [
      { num: '1', title: 'Termômetro de Sentido de Vida — Evolução Completa' },
      { num: '2', title: 'Progresso por Módulo — Checklists' },
      { num: '3', title: 'Exercícios e Reflexões por Módulo' },
      { num: '4', title: 'Diário de Reflexões Semanais' },
      { num: '5', title: 'Manifesto de Vida Pessoal' },
      { num: '6', title: 'Síntese Final e Plano de Vida' },
    ];
    return `
    <div class="pdf-page page-break-after">
      <div class="toc-title">Sumário</div>
      <div class="toc-list">
        ${sections.map(s => `
          <div class="toc-item">
            <span class="toc-num">${s.num}</span>
            <span class="toc-text">${s.title}</span>
          </div>`).join('')}
      </div>
      <div class="toc-intention">
        ${state.intention ? `
          <div class="toc-intention-label">Minha Intenção para este Programa</div>
          <div class="toc-intention-text">${esc(state.intention)}</div>
        ` : ''}
      </div>
    </div>`;
  }

  // ── SEÇÃO 1: TERMÔMETRO ──────────────────────────────────────────────────────
  function buildThermometer() {
    const moments = [
      { key: 'pre', label: 'Antes de Iniciar (Pré)' },
      ...PROGRAM_DATA.modules.map(m => ({ key: `mod${m.id}`, label: `Após Módulo ${m.id} — ${m.title}` }))
    ];
    const hasData = moments.some(({ key }) => state.thermometer[key]);

    return `
    <div class="pdf-page page-break-after">
      ${sectionHeader('🌡️', '1. Termômetro de Sentido de Vida — Evolução Completa', '#6C63FF')}
      <p class="section-desc">Avaliação do senso geral de sentido de vida ao longo do programa (1 = vazio total · 10 = pleno de sentido).</p>

      ${hasData ? `
        <table class="thermo-table">
          <thead>
            <tr>
              <th>Momento</th>
              <th style="width:200px">Pontuação</th>
              <th style="width:60px">Nota</th>
            </tr>
          </thead>
          <tbody>
            ${moments.map(({ key, label }) => {
              const val = state.thermometer[key] || 0;
              const barColor = val >= 8 ? '#10B981' : val >= 6 ? '#F7B731' : val >= 4 ? '#6C63FF' : '#EF4444';
              return `<tr class="${val ? '' : 'row-empty'}">
                <td>${label}</td>
                <td>
                  ${val ? `<div class="score-bar-wrap"><div class="score-bar-fill" style="width:${val*10}%;background:${barColor}"></div></div>` : '<span class="not-filled">Não avaliado</span>'}
                </td>
                <td style="text-align:center;font-weight:700;color:${val ? barColor : '#999'}">${val || '—'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>

        ${(() => {
          const pre = state.thermometer['pre'];
          const scores = moments.slice(1).map(({ key }) => state.thermometer[key]).filter(Boolean);
          const last = scores[scores.length - 1];
          if (!pre || !last) return '';
          const diff = last - pre;
          const diffColor = diff > 0 ? '#10B981' : diff < 0 ? '#EF4444' : '#6C63FF';
          return `
            <div class="thermo-summary">
              <div class="thermo-summary-item">
                <span class="ts-label">Pontuação Inicial</span>
                <span class="ts-value" style="color:#6C63FF">${pre}/10</span>
              </div>
              <div class="thermo-summary-item">
                <span class="ts-label">Pontuação Final</span>
                <span class="ts-value" style="color:#10B981">${last}/10</span>
              </div>
              <div class="thermo-summary-item">
                <span class="ts-label">Evolução Total</span>
                <span class="ts-value" style="color:${diffColor}">${diff > 0 ? '+' : ''}${diff} pontos</span>
              </div>
            </div>`;
        })()}
      ` : emptyNote('Nenhuma avaliação do Termômetro registrada ainda.')}
    </div>`;
  }

  // ── SEÇÃO 2: CHECKLISTS ──────────────────────────────────────────────────────
  function buildChecklists() {
    return `
    <div class="pdf-page page-break-after">
      ${sectionHeader('✅', '2. Progresso por Módulo — Checklists', '#10B981')}

      ${PROGRAM_DATA.modules.map(m => {
        const checks = state.checklists[m.id] || [];
        const done = checks.filter(Boolean).length;
        const total = m.checklist.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const dates = state.moduleDates[m.id] || {};
        const barColor = pct === 100 ? '#10B981' : pct >= 60 ? '#F7B731' : '#6C63FF';

        return `
          <div class="module-checklist-block">
            <div class="mcb-header">
              <span class="mcb-icon">${m.icon}</span>
              <div class="mcb-info">
                <div class="mcb-title">${m.week} — ${m.title}</div>
                <div class="mcb-meta">
                  ${dates.start ? `Início: ${formatDate(dates.start)}` : ''}
                  ${dates.end ? ` · Conclusão: ${formatDate(dates.end)}` : ''}
                </div>
              </div>
              <div class="mcb-pct" style="color:${barColor}">${pct}%</div>
            </div>
            <div class="score-bar-wrap" style="margin:6px 0 10px">
              <div class="score-bar-fill" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <div class="checklist-items">
              ${m.checklist.map((item, i) => `
                <div class="cl-item ${checks[i] ? 'cl-done' : 'cl-pending'}">
                  <span class="cl-box">${checks[i] ? '✓' : '○'}</span>
                  <span class="cl-text">${esc(item)}</span>
                </div>`).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
  }

  // ── SEÇÃO 3: EXERCÍCIOS ──────────────────────────────────────────────────────
  function buildExercises() {
    const pages = PROGRAM_DATA.modules.map(m => {
      const exData = state.exercises;
      const thermo = state.thermometer[`mod${m.id}`];

      let content = '';

      m.exercises.forEach(ex => {
        const data = exData[ex.id] || {};
        let exContent = '';

        switch (ex.type) {
          case 'rating_areas': {
            const areas = data.areas || {};
            const hasAny = Object.values(areas).some(v => v > 0);
            if (hasAny) {
              exContent = `<table class="areas-table">
                <thead><tr><th>Área de Vida</th><th style="width:180px">Avaliação</th><th style="width:50px">Nota</th></tr></thead>
                <tbody>
                  ${ex.areas.map(area => {
                    const val = areas[area] || 0;
                    const bc = val >= 8 ? '#10B981' : val >= 6 ? '#F7B731' : val >= 4 ? '#6C63FF' : '#EF4444';
                    return `<tr>
                      <td>${area}</td>
                      <td>${val ? `<div class="score-bar-wrap"><div class="score-bar-fill" style="width:${val*10}%;background:${bc}"></div></div>` : '<span class="not-filled">—</span>'}</td>
                      <td style="text-align:center;font-weight:700;color:${val ? bc : '#999'}">${val || '—'}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>`;
            }
            break;
          }
          case 'questions':
          case 'connections_map': {
            const answers = data.answers || {};
            const questions = ex.questions || ex.questions;
            const hasAny = Object.values(answers).some(v => v && v.trim());
            if (hasAny) {
              exContent = questions.map((q, i) =>
                answers[i] ? answerBlock(q, answers[i]) : ''
              ).join('');
            }
            break;
          }
          case 'letter':
          case 'textarea': {
            if (data.text) exContent = answerBlock('Resposta:', data.text);
            break;
          }
          case 'timeline': {
            const moments = state.timelineMoments || [];
            const hasAny = moments.some(m => m.text || m.year);
            if (hasAny) {
              exContent = moments.map((moment, i) => moment.text ? `
                <div class="timeline-pdf-item">
                  <div class="tpi-header">Momento ${i + 1}${moment.year ? ` (${moment.year})` : ''}</div>
                  <div class="tpi-text">${esc(moment.text)}</div>
                </div>` : '').join('');
            }
            break;
          }
          case 'rewrite': {
            const fields = data.fields || {};
            const hasAny = Object.values(fields).some(v => v && v.trim());
            if (hasAny) {
              exContent = ex.fields.map((f, i) =>
                fields[i] ? answerBlock(f, fields[i]) : ''
              ).join('');
            }
            break;
          }
          case 'values_selection': {
            const selected = state.valuesSelected || [];
            if (selected.length) {
              exContent = `<div class="values-pdf-list">
                ${selected.map((v, i) => `
                  <div class="vpdf-item">
                    <span class="vpdf-num">${i + 1}</span>
                    <div class="vpdf-content">
                      <div class="vpdf-name">${esc(v)}</div>
                      ${state.valuesWhy[v] ? `<div class="vpdf-why">${esc(state.valuesWhy[v])}</div>` : ''}
                    </div>
                  </div>`).join('')}
              </div>`;
            }
            break;
          }
          case 'values_alignment': {
            const alignment = state.valuesAlignment || {};
            const selected = state.valuesSelected || [];
            const hasAny = selected.some(v => alignment[v]);
            if (hasAny) {
              exContent = `<table class="areas-table">
                <thead><tr><th>Valor</th><th style="width:180px">Alinhamento</th><th style="width:50px">Nota</th></tr></thead>
                <tbody>
                  ${selected.map(v => {
                    const val = alignment[v] || 0;
                    const bc = val >= 8 ? '#10B981' : val >= 6 ? '#F7B731' : val >= 4 ? '#6C63FF' : '#EF4444';
                    return `<tr>
                      <td>${esc(v)}</td>
                      <td>${val ? `<div class="score-bar-wrap"><div class="score-bar-fill" style="width:${val*10}%;background:${bc}"></div></div>` : '<span class="not-filled">—</span>'}</td>
                      <td style="text-align:center;font-weight:700;color:${val ? bc : '#999'}">${val || '—'}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>`;
            }
            break;
          }
          case 'ikigai': {
            const ikigai = state.ikigai || {};
            const hasAny = Object.values(ikigai).some(v => v && v.trim());
            if (hasAny) {
              exContent = ex.dimensions.map(d =>
                ikigai[d.key] ? answerBlock(`${d.icon} ${d.label}`, ikigai[d.key]) : ''
              ).join('');
            }
            break;
          }
          case 'purpose_statement': {
            const hasContent = state.purposeStatement || (exData['4.2'] || {}).manifestation;
            if (hasContent) {
              exContent = [
                state.purposeStatement ? answerBlock('Minha Declaração de Propósito Pessoal:', state.purposeStatement) : '',
                (exData['4.2'] || {}).manifestation ? answerBlock('Como se manifesta no cotidiano:', (exData['4.2'] || {}).manifestation) : ''
              ].join('');
            }
            break;
          }
          case 'goals_90days': {
            const goals = state.goals90 || [];
            const hasAny = goals.some(g => g.text);
            if (hasAny) {
              exContent = goals.map((g, i) => g.text ? `
                <div class="goal-pdf-item">
                  <div class="goal-num">Meta ${i + 1}</div>
                  <div class="goal-text">${esc(g.text)}</div>
                  ${g.deadline ? `<div class="goal-deadline">📅 Prazo: ${formatDate(g.deadline)}</div>` : ''}
                </div>` : '').join('');
            }
            break;
          }
          case 'daily_practices': {
            const practiceData = state.dailyPractices[ex.id] || {};
            const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const hasAny = Object.keys(practiceData).length > 0;
            if (hasAny) {
              exContent = `<table class="practices-table">
                <thead>
                  <tr>
                    <th>Prática</th>
                    ${days.map(d => `<th style="width:36px;text-align:center">${d}</th>`).join('')}
                    <th style="width:50px;text-align:center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${ex.practices.map((p, pi) => {
                    const pd = practiceData[pi] || {};
                    const total = Object.values(pd).filter(Boolean).length;
                    return `<tr>
                      <td style="font-size:11px">${esc(p)}</td>
                      ${days.map((d, di) => `<td style="text-align:center">${pd[di] ? '✓' : '·'}</td>`).join('')}
                      <td style="text-align:center;font-weight:700;color:${total >= 5 ? '#10B981' : '#6C63FF'}">${total}/7</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>`;
              if (data.reflection) exContent += answerBlock('Reflexão sobre a semana:', data.reflection);
            }
            break;
          }
          case 'integration': {
            const answers = data.answers || {};
            const hasAny = Object.values(answers).some(v => v && v.trim());
            if (hasAny) {
              exContent = ex.modules.map((label, i) =>
                answers[i] ? answerBlock(label, answers[i]) : ''
              ).join('');
            }
            break;
          }
          case 'final_rating': {
            const areas = data.areas || {};
            const initialAreas = (exData['1.1'] || {}).areas || {};
            const hasAny = Object.values(areas).some(v => v > 0);
            if (hasAny) {
              exContent = `<table class="areas-table">
                <thead><tr><th>Área</th><th style="width:50px;text-align:center">Inicial</th><th style="width:180px">Final</th><th style="width:60px;text-align:center">Evolução</th></tr></thead>
                <tbody>
                  ${ex.areas.map(area => {
                    const initial = initialAreas[area] || 0;
                    const current = areas[area] || 0;
                    const diff = current - initial;
                    const bc = current >= 8 ? '#10B981' : current >= 6 ? '#F7B731' : current >= 4 ? '#6C63FF' : '#EF4444';
                    const dc = diff > 0 ? '#10B981' : diff < 0 ? '#EF4444' : '#999';
                    return `<tr>
                      <td>${area}</td>
                      <td style="text-align:center;color:#999">${initial || '—'}</td>
                      <td>${current ? `<div class="score-bar-wrap"><div class="score-bar-fill" style="width:${current*10}%;background:${bc}"></div></div>` : '<span class="not-filled">—</span>'}</td>
                      <td style="text-align:center;font-weight:700;color:${dc}">${diff > 0 ? '+' : ''}${diff || '—'}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>`;
              if (data.reflection) exContent += answerBlock('O que mudou em mim ao longo deste programa:', data.reflection);
            }
            break;
          }
        }

        if (exContent) {
          content += `
            <div class="exercise-pdf-block">
              <div class="epb-title">Exercício ${ex.id} — ${ex.title}</div>
              ${exContent}
            </div>`;
        }
      });

      const hasContent = content.trim() !== '';
      const p = getModuleProgress(m.id);

      return `
        <div class="pdf-page page-break-after">
          ${sectionHeader(m.icon, `Módulo ${m.id} — ${m.title}`, m.color)}
          <div class="mod-pdf-meta">
            <span>${m.week} · ${m.subtitle}</span>
            <span class="mod-pdf-pct" style="color:${m.color}">${p.pct}% concluído</span>
          </div>
          ${thermo ? `<div class="mod-thermo-badge">🌡️ Sentido de Vida após este módulo: <strong>${thermo}/10</strong></div>` : ''}
          ${hasContent ? content : emptyNote('Nenhum exercício preenchido neste módulo ainda.')}
        </div>`;
    });

    return `
    <div class="pdf-section-label page-break-before">
      ${sectionHeader('📝', '3. Exercícios e Reflexões por Módulo', '#6C63FF')}
    </div>
    ${pages.join('')}`;
  }

  // ── SEÇÃO 4: DIÁRIO ──────────────────────────────────────────────────────────
  function buildDiary() {
    const hasAny = Object.values(state.weeklyDiary).some(d => d.discovery || d.commitment || d.rating);
    return `
    <div class="pdf-page page-break-after">
      ${sectionHeader('📔', '4. Diário de Reflexões Semanais', '#FF6584')}
      ${hasAny ? PROGRAM_DATA.modules.map(m => {
        const diary = state.weeklyDiary[m.id] || {};
        if (!diary.discovery && !diary.commitment && !diary.rating) return '';
        const bc = diary.rating >= 8 ? '#10B981' : diary.rating >= 6 ? '#F7B731' : '#6C63FF';
        return `
          <div class="diary-pdf-block">
            <div class="dpb-header">
              <span class="dpb-icon">${m.icon}</span>
              <div>
                <div class="dpb-title">${m.week} — ${m.title}</div>
                ${diary.rating ? `<div class="dpb-rating" style="color:${bc}">Nota da semana: ${diary.rating}/10</div>` : ''}
              </div>
            </div>
            ${diary.discovery ? answerBlock('Principal descoberta desta semana:', diary.discovery) : ''}
            ${diary.commitment ? answerBlock('Compromisso de ação para a próxima semana:', diary.commitment) : ''}
          </div>`;
      }).join('') : emptyNote('Nenhuma reflexão semanal registrada ainda.')}
    </div>`;
  }

  // ── SEÇÃO 5: MANIFESTO ───────────────────────────────────────────────────────
  function buildManifesto() {
    const manifesto = state.manifesto || {};
    const hasAny = Object.values(manifesto).some(v => v && v.trim());
    return `
    <div class="pdf-page page-break-after">
      ${sectionHeader('✍️', '5. Manifesto de Vida Pessoal', '#F7B731')}
      <p class="section-desc">Sua declaração pessoal de sentido — quem você é, o que valoriza, para onde vai e como quer ser lembrado(a).</p>
      ${hasAny ? `
        <div class="manifesto-pdf-block">
          ${PROGRAM_DATA.manifesto.sections.map(s => manifesto[s.key] ? `
            <div class="mpb-section">
              <div class="mpb-label">${s.label}</div>
              <div class="mpb-text">${esc(manifesto[s.key])}</div>
            </div>` : '').join('')}
        </div>
        <div class="manifesto-pdf-quote">
          "No final, não seremos julgados pelo número de diplomas que recebemos,<br>
          mas pela diferença que fizemos na vida das pessoas."<br>
          <strong>— Viktor Frankl</strong>
        </div>
      ` : emptyNote('O Manifesto de Vida ainda não foi preenchido.')}
    </div>`;
  }

  // ── SEÇÃO 6: SÍNTESE FINAL ───────────────────────────────────────────────────
  function buildFinalSynthesis() {
    const ex72 = state.exercises['7.2'] || {};
    const answers72 = ex72.answers || {};
    const questions72 = PROGRAM_DATA.modules[6].exercises.find(e => e.id === '7.2');
    const hasLifePlan = questions72 && Object.values(answers72).some(v => v && v.trim());

    const goals = state.goals90 || [];
    const hasGoals = goals.some(g => g.text);

    const purposeStatement = state.purposeStatement;
    const valuesSelected = state.valuesSelected || [];

    return `
    <div class="pdf-page">
      ${sectionHeader('🌟', '6. Síntese Final e Plano de Vida', '#10B981')}

      ${purposeStatement ? `
        <div class="synthesis-highlight">
          <div class="sh-label">🎯 Minha Declaração de Propósito</div>
          <div class="sh-text">${esc(purposeStatement)}</div>
        </div>` : ''}

      ${valuesSelected.length ? `
        <div class="synthesis-block">
          <div class="sb-title">💎 Meus 5 Valores Essenciais</div>
          <div class="values-chips-pdf">
            ${valuesSelected.map((v, i) => `<span class="vcp-chip"><strong>${i+1}.</strong> ${esc(v)}</span>`).join('')}
          </div>
        </div>` : ''}

      ${hasGoals ? `
        <div class="synthesis-block">
          <div class="sb-title">📅 Metas dos Próximos 90 Dias</div>
          ${goals.filter(g => g.text).map((g, i) => `
            <div class="goal-pdf-item">
              <div class="goal-num">Meta ${i + 1}</div>
              <div class="goal-text">${esc(g.text)}</div>
              ${g.deadline ? `<div class="goal-deadline">📅 Prazo: ${formatDate(g.deadline)}</div>` : ''}
            </div>`).join('')}
        </div>` : ''}

      ${hasLifePlan && questions72 ? `
        <div class="synthesis-block">
          <div class="sb-title">🗺️ Meu Plano de Vida com Sentido</div>
          ${questions72.questions.map((q, i) =>
            answers72[i] ? answerBlock(q, answers72[i]) : ''
          ).join('')}
        </div>` : ''}

      <div class="final-quote-block">
        <div class="fqb-stars">✦ ✦ ✦</div>
        <div class="fqb-quote">"A vida nunca deixa de ter sentido, mesmo nos momentos mais miseráveis."</div>
        <div class="fqb-author">— Viktor Frankl</div>
        <div class="fqb-name">${esc(userName)}</div>
        <div class="fqb-date">Relatório gerado em ${today_str}</div>
      </div>
    </div>`;
  }

  // ── CSS DO PDF ───────────────────────────────────────────────────────────────
  const pdfCSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; font-size: 13px; line-height: 1.6; }

    /* COVER */
    .pdf-cover { text-align: center; padding: 80px 60px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%); color: #fff; }
    .cover-ornament { font-size: 28px; letter-spacing: 16px; color: #F7B731; margin-bottom: 32px; }
    .cover-program { font-size: 13px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; color: #a0a0c0; margin-bottom: 12px; }
    .cover-subtitle { font-size: 22px; font-weight: 300; color: #c0c0e0; margin-bottom: 32px; }
    .cover-name { font-size: 42px; font-weight: 800; color: #fff; margin-bottom: 12px; }
    .cover-meta { font-size: 13px; color: #6060a0; margin-bottom: 48px; display: flex; gap: 12px; align-items: center; }
    .cover-dot { color: #F7B731; }
    .cover-stats { display: flex; gap: 24px; margin-bottom: 48px; flex-wrap: wrap; justify-content: center; }
    .cover-stat { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px 28px; min-width: 120px; }
    .cover-stat-value { font-size: 32px; font-weight: 800; color: #fff; }
    .cover-stat-label { font-size: 11px; color: #6060a0; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .cover-quote { font-style: italic; font-size: 15px; color: #a0a0c0; max-width: 520px; line-height: 1.8; margin-bottom: 8px; }
    .cover-author { font-size: 13px; color: #6C63FF; font-weight: 700; margin-bottom: 48px; }
    .cover-footer { font-size: 11px; color: #404060; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; width: 100%; text-align: center; }

    /* PAGES */
    .pdf-page { padding: 48px 56px; min-height: 100vh; }
    .page-break-after { page-break-after: always; }
    .page-break-before { page-break-before: always; }

    /* TOC */
    .toc-title { font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 3px solid #6C63FF; }
    .toc-list { margin-bottom: 32px; }
    .toc-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #eee; }
    .toc-num { width: 32px; height: 32px; background: #6C63FF; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
    .toc-text { font-size: 14px; font-weight: 600; color: #1a1a2e; }
    .toc-intention { background: #f8f8ff; border-left: 4px solid #6C63FF; border-radius: 0 8px 8px 0; padding: 20px; margin-top: 24px; }
    .toc-intention-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6C63FF; margin-bottom: 8px; }
    .toc-intention-text { font-size: 14px; color: #333; line-height: 1.7; font-style: italic; }

    /* SECTION HEADERS */
    .pdf-section-header { display: flex; align-items: center; gap: 12px; border-left: 5px solid #6C63FF; padding: 12px 16px; background: #f8f8ff; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
    .pdf-section-icon { font-size: 22px; }
    .pdf-section-title { font-size: 18px; font-weight: 800; color: #1a1a2e; }
    .section-desc { font-size: 13px; color: #666; margin-bottom: 20px; line-height: 1.7; }

    /* THERMOMETER TABLE */
    .thermo-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .thermo-table th { background: #f0f0f8; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #ddd; }
    .thermo-table td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: middle; }
    .thermo-table .row-empty td { color: #bbb; }
    .thermo-summary { display: flex; gap: 16px; background: #f8f8ff; border-radius: 10px; padding: 20px; margin-top: 16px; }
    .thermo-summary-item { flex: 1; text-align: center; }
    .ts-label { display: block; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .ts-value { font-size: 24px; font-weight: 800; }

    /* SCORE BARS */
    .score-bar-wrap { background: #eee; border-radius: 20px; height: 8px; overflow: hidden; flex: 1; }
    .score-bar-fill { height: 100%; border-radius: 20px; }
    .score-label { font-size: 12px; font-weight: 700; white-space: nowrap; margin-left: 8px; }
    .not-filled { color: #bbb; font-size: 12px; }

    /* MODULE CHECKLIST */
    .module-checklist-block { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
    .mcb-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
    .mcb-icon { font-size: 22px; flex-shrink: 0; }
    .mcb-info { flex: 1; }
    .mcb-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
    .mcb-meta { font-size: 11px; color: #999; margin-top: 2px; }
    .mcb-pct { font-size: 22px; font-weight: 800; }
    .checklist-items { margin-top: 10px; }
    .cl-item { display: flex; align-items: flex-start; gap: 10px; padding: 7px 0; border-bottom: 1px solid #f0f0f0; }
    .cl-item:last-child { border-bottom: none; }
    .cl-box { width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 1px; }
    .cl-done .cl-box { background: #10B981; color: #fff; }
    .cl-pending .cl-box { border: 2px solid #ddd; color: transparent; }
    .cl-text { font-size: 13px; }
    .cl-done .cl-text { color: #999; text-decoration: line-through; }

    /* EXERCISES */
    .mod-pdf-meta { font-size: 12px; color: #999; margin-bottom: 12px; display: flex; justify-content: space-between; }
    .mod-pdf-pct { font-weight: 700; }
    .mod-thermo-badge { background: #f0f0ff; border: 1px solid #d0d0ff; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #6C63FF; margin-bottom: 16px; display: inline-block; }
    .exercise-pdf-block { margin-bottom: 24px; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
    .epb-title { background: #f8f8ff; padding: 12px 16px; font-size: 13px; font-weight: 700; color: #1a1a2e; border-bottom: 1px solid #eee; }
    .answer-block { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; }
    .answer-block:last-child { border-bottom: none; }
    .answer-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6C63FF; margin-bottom: 6px; }
    .answer-text { font-size: 13px; color: #333; line-height: 1.7; white-space: pre-wrap; }
    .empty-note { background: #fafafa; border: 1px dashed #ddd; border-radius: 8px; padding: 20px; text-align: center; color: #bbb; font-size: 13px; font-style: italic; }

    /* AREAS TABLE */
    .areas-table { width: 100%; border-collapse: collapse; }
    .areas-table th { background: #f8f8ff; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #eee; }
    .areas-table td { padding: 8px 12px; border-bottom: 1px solid #f5f5f5; font-size: 13px; vertical-align: middle; }

    /* VALUES */
    .values-pdf-list { padding: 12px 16px; }
    .vpdf-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
    .vpdf-item:last-child { border-bottom: none; }
    .vpdf-num { width: 24px; height: 24px; background: #6C63FF; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
    .vpdf-content { flex: 1; }
    .vpdf-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .vpdf-why { font-size: 12px; color: #666; margin-top: 3px; font-style: italic; }

    /* TIMELINE */
    .timeline-pdf-item { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; }
    .timeline-pdf-item:last-child { border-bottom: none; }
    .tpi-header { font-size: 12px; font-weight: 700; color: #6C63FF; margin-bottom: 6px; }
    .tpi-text { font-size: 13px; color: #333; line-height: 1.7; }

    /* PRACTICES TABLE */
    .practices-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .practices-table th { background: #f8f8ff; padding: 7px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #eee; }
    .practices-table td { padding: 7px 8px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; }

    /* GOALS */
    .goal-pdf-item { background: #f8fff8; border: 1px solid #d0f0d0; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
    .goal-num { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #10B981; margin-bottom: 6px; }
    .goal-text { font-size: 14px; color: #1a1a2e; line-height: 1.6; }
    .goal-deadline { font-size: 12px; color: #999; margin-top: 6px; }

    /* DIARY */
    .diary-pdf-block { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
    .dpb-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .dpb-icon { font-size: 22px; }
    .dpb-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
    .dpb-rating { font-size: 13px; font-weight: 700; margin-top: 2px; }

    /* MANIFESTO */
    .manifesto-pdf-block { background: linear-gradient(135deg, #f8f8ff, #fffdf0); border: 2px solid #F7B731; border-radius: 12px; padding: 32px; margin-bottom: 24px; }
    .mpb-section { margin-bottom: 24px; }
    .mpb-section:last-child { margin-bottom: 0; }
    .mpb-label { font-size: 16px; font-weight: 800; color: #F7B731; margin-bottom: 10px; letter-spacing: 0.5px; }
    .mpb-text { font-size: 14px; color: #333; line-height: 1.8; white-space: pre-wrap; }
    .manifesto-pdf-quote { text-align: center; font-style: italic; font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; line-height: 1.8; }

    /* SYNTHESIS */
    .synthesis-highlight { background: linear-gradient(135deg, #f0f0ff, #fff8f0); border: 2px solid #6C63FF; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .sh-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6C63FF; margin-bottom: 10px; }
    .sh-text { font-size: 16px; color: #1a1a2e; line-height: 1.7; font-style: italic; font-weight: 600; }
    .synthesis-block { margin-bottom: 24px; }
    .sb-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #eee; }
    .values-chips-pdf { display: flex; flex-wrap: wrap; gap: 10px; }
    .vcp-chip { background: #f0f0ff; border: 1px solid #d0d0ff; border-radius: 20px; padding: 6px 14px; font-size: 13px; color: #6C63FF; }

    /* FINAL QUOTE */
    .final-quote-block { text-align: center; background: linear-gradient(160deg, #0f0f1a, #1a1a2e); color: #fff; border-radius: 16px; padding: 48px 40px; margin-top: 32px; }
    .fqb-stars { font-size: 20px; letter-spacing: 12px; color: #F7B731; margin-bottom: 20px; }
    .fqb-quote { font-style: italic; font-size: 16px; color: #c0c0e0; line-height: 1.8; margin-bottom: 10px; }
    .fqb-author { font-size: 13px; color: #6C63FF; font-weight: 700; margin-bottom: 24px; }
    .fqb-name { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
    .fqb-date { font-size: 12px; color: #6060a0; }

    /* PRINT */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-break-after { page-break-after: always; }
      .page-break-before { page-break-before: always; }
    }
  `;

  // ── MONTAR HTML COMPLETO ─────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório — ${esc(userName)} — Redescobrindo o Sentido da Vida</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>${pdfCSS}</style>
</head>
<body>
  ${buildCover()}
  ${buildSummary()}
  ${buildThermometer()}
  ${buildChecklists()}
  ${buildExercises()}
  ${buildDiary()}
  ${buildManifesto()}
  ${buildFinalSynthesis()}
  <script>
    // Auto-print quando abrir
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 800);
    });
  <\/script>
</body>
</html>`;

  // ── ABRIR EM NOVA JANELA E IMPRIMIR ─────────────────────────────────────────
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    showToast('Permita pop-ups para gerar o PDF.', 'info');
    return;
  }
  win.document.write(html);
  win.document.close();
  if (typeof unlockAchievement === 'function') unlockAchievement('pdf_exported');
  showToast('📄 Relatório gerado! Use Ctrl+P / Cmd+P → "Salvar como PDF".', 'success');
}