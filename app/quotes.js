// ===== SISTEMA DE FRASES INSPIRADORAS =====
// Frases de Viktor Frankl e outros autores relevantes,
// organizadas por módulo e por categoria temática.

const QUOTES_DATA = {

  // ── Frases por Módulo ────────────────────────────────────────────────────────
  byModule: {
    1: [
      { text: "O vazio existencial é a expressão de uma necessidade genuína e profunda — a necessidade de sentido — que está sendo negligenciada.", author: "Viktor Frankl" },
      { text: "Entre o estímulo e a resposta há um espaço. Nesse espaço está o nosso poder de escolher nossa resposta.", author: "Viktor Frankl" },
      { text: "Aquele que tem um porquê para viver pode suportar quase qualquer como.", author: "Friedrich Nietzsche" },
      { text: "O primeiro passo para mudar é a consciência. O segundo passo é a aceitação.", author: "Nathaniel Branden" },
      { text: "Não é o que acontece com você, mas como você reage que importa.", author: "Epicteto" },
    ],
    2: [
      { text: "O passado é a coisa mais permanente que existe. Nada pode tirar de nós o que já vivemos, o que já amamos, o que já realizamos.", author: "Viktor Frankl" },
      { text: "Sua história não é sua prisão. É o solo fértil de onde você cresce.", author: "Brené Brown" },
      { text: "Não somos o que nos aconteceu. Somos o que escolhemos nos tornar.", author: "Carl Jung" },
      { text: "A resiliência não é sobre nunca cair. É sobre se levantar cada vez que cai.", author: "Nelson Mandela" },
      { text: "Cada cicatriz tem uma história. Não deixe que ela defina você — deixe que ela te fortaleça.", author: "Anônimo" },
    ],
    3: [
      { text: "Cada homem é questionado pela vida; e ele somente pode responder à vida respondendo por sua própria vida.", author: "Viktor Frankl" },
      { text: "Seus valores são a bússola que guia cada decisão que você toma.", author: "Roy Disney" },
      { text: "Quando seus valores são claros para você, tomar decisões se torna mais fácil.", author: "Roy Disney" },
      { text: "Viver de acordo com seus valores é a forma mais profunda de integridade.", author: "Brené Brown" },
      { text: "Conheça seus valores. Eles são o fundamento de tudo que você constrói.", author: "Anônimo" },
    ],
    4: [
      { text: "A felicidade não pode ser perseguida; ela deve emergir. Deve ser o efeito colateral não intencional da dedicação pessoal a uma causa maior do que si mesmo.", author: "Viktor Frankl" },
      { text: "O propósito não é encontrado. É construído, tijolo por tijolo, escolha por escolha.", author: "Adam Grant" },
      { text: "Não pergunte o que o mundo precisa. Pergunte o que te faz sentir vivo — porque o que o mundo precisa são pessoas que se sintam vivas.", author: "Howard Thurman" },
      { text: "Seu trabalho vai preencher uma grande parte da sua vida, e a única maneira de ser verdadeiramente satisfeito é fazer o que você acredita ser um ótimo trabalho.", author: "Steve Jobs" },
      { text: "O segredo da existência humana não está apenas em viver, mas em saber para que se vive.", author: "Fiódor Dostoiévski" },
    ],
    5: [
      { text: "Amar é a única maneira de apreender outro ser humano no mais íntimo de sua personalidade.", author: "Viktor Frankl" },
      { text: "Quanto mais o ser humano se esquece de si mesmo — se doando a uma causa ou a outra pessoa — mais humano ele se torna.", author: "Viktor Frankl" },
      { text: "A conexão é o motivo pelo qual estamos aqui. É o que dá propósito e significado às nossas vidas.", author: "Brené Brown" },
      { text: "Nenhum homem é uma ilha. Cada homem é um pedaço do continente.", author: "John Donne" },
      { text: "Você não pode viver uma vida perfeita sem fazer algo por outros.", author: "Albert Einstein" },
    ],
    6: [
      { text: "O sofrimento deixa de ser sofrimento de alguma forma no momento em que encontra um sentido, como o sentido de um sacrifício.", author: "Viktor Frankl" },
      { text: "A última das liberdades humanas é a de escolher a própria atitude em qualquer conjunto de circunstâncias.", author: "Viktor Frankl" },
      { text: "Aquilo que não me mata me fortalece.", author: "Friedrich Nietzsche" },
      { text: "O sofrimento é parte da vida. Não precisamos gostar dele, mas precisamos ser capazes de suportá-lo.", author: "Marsha Linehan" },
      { text: "Dentro de cada adversidade existe a semente de um benefício equivalente ou maior.", author: "Napoleon Hill" },
    ],
    7: [
      { text: "Viver como se você estivesse vivendo pela segunda vez e como se tivesse agido tão erroneamente na primeira vez como está prestes a agir agora.", author: "Viktor Frankl" },
      { text: "A vida nunca deixa de ter sentido, mesmo nos momentos mais miseráveis.", author: "Viktor Frankl" },
      { text: "No final, não seremos julgados pelo número de diplomas que recebemos, mas pela diferença que fizemos na vida das pessoas.", author: "Viktor Frankl" },
      { text: "Uma vida bem vivida é a melhor vingança.", author: "George Herbert" },
      { text: "Não é o fim que importa, mas a jornada que nos transforma.", author: "Anônimo" },
    ],
  },

  // ── Frases Diárias (rotação por dia da semana) ───────────────────────────────
  daily: [
    // Segunda
    { text: "Cada manhã traz uma nova oportunidade de escolher quem você quer ser.", author: "Viktor Frankl", emoji: "🌅" },
    // Terça
    { text: "O sentido não é dado — é descoberto. E você tem tudo que precisa para encontrá-lo.", author: "Viktor Frankl", emoji: "🔍" },
    // Quarta
    { text: "Pequenos passos consistentes constroem grandes transformações.", author: "Anônimo", emoji: "👣" },
    // Quinta
    { text: "Você é mais resiliente do que imagina. Sua história prova isso.", author: "Brené Brown", emoji: "💪" },
    // Sexta
    { text: "Gratidão transforma o que temos em suficiente.", author: "Melody Beattie", emoji: "🙏" },
    // Sábado
    { text: "Descansar não é desistir. É se preparar para continuar com mais força.", author: "Anônimo", emoji: "🌿" },
    // Domingo
    { text: "Reflita sobre a semana: o que você aprendeu sobre si mesmo?", author: "Viktor Frankl", emoji: "📔" },
  ],

  // ── Frases de Encorajamento (exibidas em momentos de dificuldade) ────────────
  encouragement: [
    { text: "Você chegou até aqui. Isso já é extraordinário.", emoji: "⭐" },
    { text: "Cada exercício que você completa é um passo em direção a uma vida mais significativa.", emoji: "🚶" },
    { text: "A jornada de autodescoberta exige coragem. Você a tem.", emoji: "🦁" },
    { text: "Não precisa ser perfeito. Precisa ser autêntico.", emoji: "💎" },
    { text: "Frankl sobreviveu ao impensável porque encontrou sentido. Você também pode.", emoji: "🌟" },
    { text: "Cada reflexão honesta que você escreve é um presente para o seu futuro.", emoji: "🎁" },
    { text: "O vazio que você sente é o espaço onde o sentido vai crescer.", emoji: "🌱" },
    { text: "Você não está sozinho nessa jornada. Milhões já percorreram esse caminho.", emoji: "🤝" },
  ],

  // ── Frases de Celebração (ao concluir tarefas/módulos) ──────────────────────
  celebration: [
    { text: "Incrível! Cada passo que você dá é uma vitória sobre o vazio existencial.", emoji: "🎉" },
    { text: "Você está construindo uma vida com sentido, tijolo por tijolo.", emoji: "🏗️" },
    { text: "Frankl diria: você está respondendo à vida com suas ações. Continue!", emoji: "✨" },
    { text: "Sua coragem de olhar para dentro é o que transforma vidas.", emoji: "🔥" },
    { text: "Cada reflexão honesta te aproxima da sua versão mais autêntica.", emoji: "💫" },
  ],
};

// ── Funções de acesso ────────────────────────────────────────────────────────

function getDailyQuote() {
  const dayOfWeek = new Date().getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
  const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return QUOTES_DATA.daily[idx];
}

function getModuleQuotes(moduleId) {
  return QUOTES_DATA.byModule[moduleId] || [];
}

function getRandomQuote(category = 'encouragement') {
  const arr = QUOTES_DATA[category] || QUOTES_DATA.encouragement;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomModuleQuote(moduleId) {
  const quotes = getModuleQuotes(moduleId);
  if (!quotes.length) return getRandomQuote('encouragement');
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// ── Widget de frase diária ───────────────────────────────────────────────────
function renderDailyQuoteWidget() {
  const quote = getDailyQuote();
  const el = document.getElementById('daily-quote-widget');
  if (!el) return;
  el.innerHTML = `
    <div class="daily-quote-inner">
      <div class="dq-emoji">${quote.emoji}</div>
      <div class="dq-text">"${quote.text}"</div>
      <div class="dq-author">— ${quote.author}</div>
      <button class="dq-refresh" onclick="refreshDailyQuote()" title="Nova frase">↻</button>
    </div>`;
}

let _quoteRefreshIdx = 0;
function refreshDailyQuote() {
  const allQuotes = [
    ...QUOTES_DATA.daily,
    ...Object.values(QUOTES_DATA.byModule).flat(),
    ...QUOTES_DATA.encouragement,
  ];
  _quoteRefreshIdx = (_quoteRefreshIdx + 1) % allQuotes.length;
  const quote = allQuotes[_quoteRefreshIdx];
  const el = document.getElementById('daily-quote-widget');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = `
      <div class="daily-quote-inner">
        <div class="dq-emoji">${quote.emoji || '💬'}</div>
        <div class="dq-text">"${quote.text}"</div>
        <div class="dq-author">— ${quote.author}</div>
        <button class="dq-refresh" onclick="refreshDailyQuote()" title="Nova frase">↻</button>
      </div>`;
    el.style.opacity = '1';
  }, 300);
}