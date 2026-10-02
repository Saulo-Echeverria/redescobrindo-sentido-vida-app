const PROGRAM_DATA = {
  title: "Redescobrindo o Sentido da Vida",
  subtitle: "Baseado na Logoterapia de Viktor Frankl, Psicologia Positiva, Neurociência e TCC",
  quote: "A última das liberdades humanas é a de escolher a própria atitude em qualquer conjunto de circunstâncias.",
  quoteAuthor: "Viktor Frankl",
  modules: [
    {
      id: 1,
      title: "Despertar Existencial",
      week: "Semana 1",
      subtitle: "Reconhecendo o Vazio e Abrindo-se para o Sentido",
      color: "#6C63FF",
      icon: "🌅",
      quote: "O vazio existencial é a expressão de uma necessidade genuína e profunda — a necessidade de sentido — que está sendo negligenciada.",
      concept: {
        title: "O Vácuo Existencial",
        text: "O vácuo existencial é uma sensação generalizada de vazio interior, ausência de sentido e falta de direção. Frankl o diagnosticou como um dos fenômenos mais significativos da modernidade. Ele surge quando a nossa Vontade de Sentido permanece frustrada por tempo prolongado.",
        signs: {
          internal: ["Sensação de viver no 'piloto automático'", "Dificuldade de encontrar motivação genuína", "Tédio crônico e apatia persistente", "Sensação de que a vida não tem direção", "Fadiga emocional sem causa aparente"],
          behavioral: ["Busca compulsiva por distrações digitais", "Workaholismo como fuga do vazio", "Relações superficiais como substitutos do amor", "Conformismo e submissão a expectativas externas", "Busca de experiências extremas para 'sentir algo'"]
        }
      },
      exercises: [
        {
          id: "1.1",
          title: "Diagnóstico do Vazio",
          description: "Reflita honestamente sobre cada área da sua vida e avalie seu nível de satisfação e sentido (1 = muito insatisfeito, 10 = muito satisfeito):",
          type: "rating_areas",
          areas: ["Trabalho / Carreira", "Relacionamentos", "Saúde e Corpo", "Espiritualidade / Propósito", "Lazer e Criatividade", "Contribuição ao Mundo", "Crescimento Pessoal"]
        },
        {
          id: "1.2",
          title: "A Pergunta Fundamental",
          description: "Frankl afirmava que a vida nos faz perguntas — e nós respondemos com nossas ações e atitudes. Responda com sinceridade:",
          type: "questions",
          questions: [
            "Se eu soubesse que tenho apenas 1 ano de vida, o que mudaria imediatamente?",
            "Qual é a área da minha vida onde sinto mais vazio ou falta de sentido?",
            "O que me faz sentir mais vivo(a) e presente?"
          ]
        },
        {
          id: "1.3",
          title: "Carta para o Vazio",
          description: "Escreva uma carta curta para o seu vazio existencial. Reconheça-o, agradeça pelo sinal que ele representa e declare sua intenção de buscar sentido:",
          type: "letter",
          placeholder: "Querido Vazio,\n\n..."
        }
      ],
      checklist: [
        "Li e compreendi o conceito de vácuo existencial",
        "Completei o diagnóstico das áreas da minha vida",
        "Respondi à pergunta fundamental com honestidade",
        "Escrevi minha carta para o vazio",
        "Identifiquei pelo menos 3 sinais do vácuo existencial na minha vida"
      ]
    },
    {
      id: 2,
      title: "Compreendendo Sua História",
      week: "Semana 2",
      subtitle: "Integrando o Passado como Fonte de Sentido",
      color: "#FF6584",
      icon: "📖",
      quote: "O passado é a coisa mais permanente que existe. Nada pode tirar de nós o que já vivemos, o que já amamos, o que já realizamos.",
      concept: {
        title: "A Narrativa de Vida",
        text: "Dan McAdams demonstrou que os seres humanos constroem identidade através de narrativas pessoais — histórias que damos sentido ao nosso passado, presente e futuro. Frankl acrescentou: o passado é a dimensão mais segura da existência, pois nada pode apagar o que já foi vivido com sentido.",
        signs: null
      },
      exercises: [
        {
          id: "2.1",
          title: "Linha do Tempo da Minha Vida",
          description: "Registre os 5 momentos mais marcantes da sua vida (positivos e negativos) e o que cada um ensinou sobre você:",
          type: "timeline",
          moments: 5
        },
        {
          id: "2.2",
          title: "Meus Recursos de Resiliência",
          description: "Identifique as forças internas que o(a) ajudaram a superar momentos difíceis:",
          type: "questions",
          questions: [
            "Quais foram os momentos mais difíceis que já superei?",
            "O que me deu força para continuar nesses momentos?",
            "Que qualidades pessoais ficaram mais fortes após essas experiências?"
          ]
        },
        {
          id: "2.3",
          title: "Reescrevendo a Narrativa",
          description: "Escolha uma experiência dolorosa do passado e reescreva-a sob a perspectiva do crescimento e do sentido:",
          type: "rewrite",
          fields: [
            "A experiência (como eu costumava ver):",
            "O que essa experiência me ensinou / como ela me fortaleceu:",
            "Como essa experiência contribuiu para quem sou hoje:"
          ]
        }
      ],
      checklist: [
        "Mapeei os 5 momentos mais marcantes da minha vida",
        "Identifiquei meus principais recursos de resiliência",
        "Reescrevi uma experiência dolorosa sob perspectiva de crescimento",
        "Reconheci padrões de força e superação na minha história",
        "Compreendi como meu passado contribui para meu sentido de vida"
      ]
    },
    {
      id: 3,
      title: "Descobrindo Valores Essenciais",
      week: "Semana 3",
      subtitle: "Identificando o que Realmente Importa",
      color: "#43B89C",
      icon: "💎",
      quote: "Cada homem é questionado pela vida; e ele somente pode responder à vida respondendo por sua própria vida.",
      concept: {
        title: "As Três Vias de Acesso ao Sentido (Frankl)",
        text: "Frankl identificou três caminhos para encontrar sentido: Valores Criativos (o que damos ao mundo), Valores Vivenciais (o que recebemos: amor, beleza, encontros) e Valores Atitudinais (a postura diante do sofrimento inevitável).",
        signs: null
      },
      exercises: [
        {
          id: "3.1",
          title: "Mapeamento de Valores",
          description: "Selecione os valores que mais ressoam com você (seja honesto — não o que 'deveria' valorizar, mas o que genuinamente valoriza). Escolha seus 5 mais essenciais:",
          type: "values_selection",
          values: ["Amor", "Liberdade", "Criatividade", "Justiça", "Família", "Espiritualidade", "Saúde", "Conhecimento", "Beleza", "Serviço", "Autenticidade", "Coragem", "Compaixão", "Excelência", "Conexão", "Legado", "Aventura", "Paz", "Integridade", "Crescimento", "Comunidade", "Gratidão", "Humor", "Sabedoria", "Responsabilidade"]
        },
        {
          id: "3.2",
          title: "Alinhamento Valores × Vida Real",
          description: "Avalie o quanto sua vida atual está alinhada com cada valor essencial (1 = nada alinhado, 10 = totalmente alinhado):",
          type: "values_alignment"
        },
        {
          id: "3.3",
          title: "Reflexão sobre Desalinhamento",
          description: "Onde existe maior desalinhamento? O que posso fazer para mudar isso?",
          type: "textarea",
          placeholder: "Reflita sobre as áreas de maior desalinhamento e as ações que pode tomar..."
        }
      ],
      checklist: [
        "Identifiquei meus 5 valores essenciais autênticos",
        "Compreendi as três vias de acesso ao sentido de Frankl",
        "Avaliei o alinhamento entre meus valores e minha vida atual",
        "Identifiquei áreas de desalinhamento e possíveis ações",
        "Criei minha hierarquia pessoal de valores"
      ]
    },
    {
      id: 4,
      title: "Encontrando Propósito",
      week: "Semana 4",
      subtitle: "Da Busca ao Descobrimento do Sentido Único",
      color: "#F7B731",
      icon: "🎯",
      quote: "A felicidade não pode ser perseguida; ela deve emergir. Deve ser o efeito colateral não intencional da dedicação pessoal a uma causa maior do que si mesmo.",
      concept: {
        title: "Propósito vs. Felicidade",
        text: "Pesquisa de Roy Baumeister demonstrou que felicidade e sentido são construtos distintos. A felicidade está associada a receber (satisfação de necessidades, prazer), enquanto o sentido está associado a dar (contribuição, responsabilidade, conexão com algo maior). Atividades que aumentam o sentido frequentemente envolvem esforço e sacrifício.",
        signs: null
      },
      exercises: [
        {
          id: "4.1",
          title: "A Ferramenta Ikigai Expandida",
          description: "O Ikigai japonês ('razão de ser') integra quatro dimensões. Responda cada uma:",
          type: "ikigai",
          dimensions: [
            { key: "love", label: "O que eu AMO fazer?", description: "Atividades que me fazem perder a noção do tempo", icon: "❤️" },
            { key: "good", label: "No que sou EXCELENTE?", description: "Talentos naturais e habilidades desenvolvidas", icon: "⭐" },
            { key: "world", label: "O que o MUNDO PRECISA?", description: "Problemas que me indignam e que quero resolver", icon: "🌍" },
            { key: "paid", label: "Pelo que posso ser REMUNERADO(A)?", description: "Como posso sustentar minha missão", icon: "💰" },
            { key: "ikigai", label: "A INTERSEÇÃO — Meu Ikigai", description: "Onde essas quatro dimensões se encontram", icon: "✨" }
          ]
        },
        {
          id: "4.2",
          title: "Declaração de Propósito Pessoal",
          description: "Com base nos exercícios anteriores, escreva sua declaração de propósito pessoal. Use o modelo: 'Meu propósito é [VERBO DE AÇÃO] + [QUEM] + [PARA QUÊ]'",
          type: "purpose_statement",
          examples: [
            "Meu propósito é inspirar jovens em situação de vulnerabilidade a descobrirem seu potencial através da educação.",
            "Meu propósito é criar ambientes de trabalho onde as pessoas se sintam valorizadas e possam crescer.",
            "Meu propósito é cuidar da saúde das pessoas com compaixão e excelência técnica."
          ]
        },
        {
          id: "4.3",
          title: "Metas Alinhadas ao Propósito",
          description: "Liste 3 metas concretas para os próximos 90 dias que estejam alinhadas com seu propósito:",
          type: "goals_90days",
          count: 3
        }
      ],
      checklist: [
        "Completei o exercício Ikigai nas quatro dimensões",
        "Escrevi minha Declaração de Propósito Pessoal",
        "Identifiquei como meu propósito se manifesta no cotidiano",
        "Defini 3 metas concretas alinhadas ao meu propósito",
        "Compreendi a diferença entre felicidade hedônica e sentido eudaimônico"
      ]
    },
    {
      id: 5,
      title: "Autotranscendência",
      week: "Semana 5",
      subtitle: "Indo Além de Si Mesmo em Direção ao Outro",
      color: "#A855F7",
      icon: "🦋",
      quote: "Amar é a única maneira de apreender outro ser humano no mais íntimo de sua personalidade.",
      concept: {
        title: "Autotranscendência",
        text: "Um dos conceitos mais originais de Frankl é o de autotranscendência — a capacidade humana de ir além de si mesmo em direção a algo ou alguém. Paradoxalmente, quanto mais o ser humano se esquece de si mesmo em favor de algo maior, mais plenamente se realiza como pessoa.",
        signs: null
      },
      exercises: [
        {
          id: "5.1",
          title: "Mapa de Conexões Significativas",
          description: "Identifique as pessoas e relações que mais contribuem para seu senso de sentido:",
          type: "connections_map",
          questions: [
            "As 3 pessoas mais importantes na minha vida e por quê:",
            "Como posso aprofundar essas relações? Que ações concretas posso tomar?",
            "Existe alguém que precisa de mim e que estou negligenciando?"
          ]
        },
        {
          id: "5.2",
          title: "Causas que Me Transcendem",
          description: "Frankl afirmava que o ser humano encontra sentido quando serve a algo maior que si mesmo. Reflita:",
          type: "questions",
          questions: [
            "Que causas, projetos ou comunidades me fazem sentir parte de algo maior?",
            "Como posso contribuir mais ativamente para essas causas?",
            "Que legado quero deixar para as próximas gerações?"
          ]
        },
        {
          id: "5.3",
          title: "Práticas Diárias de Autotranscendência",
          description: "Comprometa-se com estas práticas diárias ao longo da semana. Marque ao completar cada dia:",
          type: "daily_practices",
          practices: [
            "Escrevi 3 coisas pelas quais sou grato(a) hoje",
            "Fiz algo generoso por alguém sem esperar retorno",
            "Expressei amor ou apreciação a alguém importante",
            "Contribuí de alguma forma para uma causa maior",
            "Pratiquei presença plena em um relacionamento significativo"
          ]
        }
      ],
      checklist: [
        "Mapeei minhas conexões mais significativas",
        "Identifiquei causas que me transcendem",
        "Defini como posso contribuir mais ativamente",
        "Pratiquei gratidão e generosidade ao longo da semana",
        "Refleti sobre o legado que quero deixar"
      ]
    },
    {
      id: 6,
      title: "Transformando o Sofrimento",
      week: "Semana 6",
      subtitle: "Encontrando Sentido nas Circunstâncias Mais Difíceis",
      color: "#EF4444",
      icon: "🔥",
      quote: "O sofrimento deixa de ser sofrimento de alguma forma no momento em que encontra um sentido, como o sentido de um sacrifício.",
      concept: {
        title: "Otimismo Trágico",
        text: "Frankl propõe o conceito de 'otimismo trágico' — a capacidade de manter esperança e afirmar a vida apesar da 'tríade trágica': dor, culpa e morte. Não se trata de otimismo ingênuo ou negação da realidade, mas de uma escolha consciente e corajosa de dizer 'sim' à vida apesar de tudo.",
        signs: null
      },
      exercises: [
        {
          id: "6.1",
          title: "Mapeando Meu Sofrimento Atual",
          description: "Identifique as principais fontes de sofrimento em sua vida atual:",
          type: "questions",
          questions: [
            "Qual é o maior sofrimento ou desafio que enfrento atualmente?",
            "Este sofrimento é evitável (posso mudar a situação) ou inevitável (devo mudar minha atitude)?",
            "Se é evitável: que ações concretas posso tomar para mudar a situação?",
            "Se é inevitável: que atitude posso escolher diante dele?"
          ]
        },
        {
          id: "6.2",
          title: "A Técnica da Intenção Paradoxal",
          description: "Frankl desenvolveu a 'intenção paradoxal' — uma técnica onde o paciente é encorajado a desejar ou até exagerar o que teme. Isso quebra o ciclo de ansiedade antecipatória.",
          type: "questions",
          questions: [
            "Qual é meu maior medo ou ansiedade recorrente?",
            "Se eu 'quisesse' que esse medo acontecesse ao máximo, o que percebo? (humor e distância ajudam)",
            "O que essa técnica me revela sobre minha relação com esse medo?"
          ]
        },
        {
          id: "6.3",
          title: "Crescimento Pós-Traumático",
          description: "Reflita sobre uma experiência difícil que já passou e identifique o crescimento que ela gerou:",
          type: "questions",
          questions: [
            "A experiência difícil:",
            "Como minhas relações melhoraram após essa experiência?",
            "Que novas possibilidades se abriram?",
            "Como minha força pessoal cresceu?",
            "Que nova perspectiva sobre a vida adquiri?"
          ]
        }
      ],
      checklist: [
        "Mapeei meu sofrimento atual e classifiquei como evitável ou inevitável",
        "Pratiquei a técnica da intenção paradoxal",
        "Identifiquei crescimento pós-traumático em experiências passadas",
        "Desenvolvi uma atitude de otimismo trágico diante de desafios",
        "Compreendi que posso escolher minha atitude mesmo quando não posso mudar a situação"
      ]
    },
    {
      id: 7,
      title: "Construindo uma Vida com Significado",
      week: "Semana 7",
      subtitle: "Integrando e Vivendo o Sentido Descoberto",
      color: "#10B981",
      icon: "🌟",
      quote: "Viver como se você estivesse vivendo pela segunda vez e como se tivesse agido tão erroneamente na primeira vez como está prestes a agir agora.",
      concept: {
        title: "Integração Final",
        text: "O módulo final integra todos os aprendizados anteriores em um plano de vida concreto e sustentável. Aqui você consolida sua jornada e cria estruturas para viver com sentido de forma contínua.",
        signs: null
      },
      exercises: [
        {
          id: "7.1",
          title: "Integração: O Que Aprendi",
          description: "Faça uma síntese dos principais aprendizados de cada módulo:",
          type: "integration",
          modules: [
            "Módulo 1 — Despertar Existencial: O que aprendi sobre meu vazio e minha busca:",
            "Módulo 2 — Minha História: O que aprendi sobre minha resiliência e recursos:",
            "Módulo 3 — Valores: Meus valores essenciais e como eles me guiam:",
            "Módulo 4 — Propósito: Minha declaração de propósito e como ela se manifesta:",
            "Módulo 5 — Autotranscendência: Como me conecto com algo maior que eu mesmo(a):",
            "Módulo 6 — Sofrimento: Como transformo desafios em crescimento:"
          ]
        },
        {
          id: "7.2",
          title: "Meu Plano de Vida com Sentido",
          description: "Com base em tudo que descobriu, crie seu plano de vida integrado:",
          type: "questions",
          questions: [
            "Minha visão de vida para os próximos 5 anos (como quero que minha vida seja):",
            "Meus 3 compromissos mais importantes para viver com sentido:",
            "Que hábitos diários vou cultivar para manter o sentido vivo?",
            "Que obstáculos posso encontrar e como vou superá-los?"
          ]
        },
        {
          id: "7.3",
          title: "Avaliação Final do Programa",
          description: "Compare sua avaliação inicial (Módulo 1) com sua avaliação atual:",
          type: "final_rating",
          areas: ["Trabalho / Carreira", "Relacionamentos", "Saúde e Corpo", "Espiritualidade / Propósito", "Lazer e Criatividade", "Contribuição ao Mundo", "Crescimento Pessoal"]
        }
      ],
      checklist: [
        "Integrei os aprendizados de todos os 7 módulos",
        "Criei meu Plano de Vida com Sentido",
        "Defini hábitos diários para manter o sentido vivo",
        "Avaliei meu progresso comparando início e fim do programa",
        "Estou pronto(a) para viver com mais autenticidade e propósito"
      ]
    }
  ],
  manifesto: {
    title: "Meu Manifesto de Vida",
    description: "O Manifesto de Vida é sua declaração pessoal de sentido — um documento vivo que expressa quem você é, o que valoriza, para onde vai e como quer ser lembrado(a). Escreva com o coração:",
    sections: [
      { key: "eu_sou", label: "EU SOU...", placeholder: "Sua identidade essencial..." },
      { key: "eu_acredito", label: "EU ACREDITO...", placeholder: "Seus valores e convicções..." },
      { key: "eu_comprometo", label: "EU ME COMPROMETO...", placeholder: "Suas ações e escolhas..." },
      { key: "eu_contribuo", label: "EU CONTRIBUO...", placeholder: "Seu impacto no mundo..." },
      { key: "eu_legado", label: "EU DEIXO COMO LEGADO...", placeholder: "O que quer que persista após você..." }
    ]
  }
};