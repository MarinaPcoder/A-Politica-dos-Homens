(function () {
  'use strict';

  const site = {
    name: 'A Política dos Homens',
    tagline: 'Ideias que atravessaram os séculos.',
    description: 'Uma experiência digital criada para reunir, apresentar e preservar podcasts produzidos por estudantes a partir do estudo da Filosofia Política.',
    cover: 'imagens/capa/capa-principal.jpg',
    coverFallback: 'imagens/placeholders/capa-principal.svg'
  };

  const episodes = [
    {
      id: 'marx',
      number: '01',
      group: 1,
      philosopher: 'Karl Marx',
      shortName: 'Marx',
      title: 'A Dialética e a Luta de Classes',
      description: 'Um episódio dedicado às relações entre história, trabalho, conflito social e transformação política no pensamento de Karl Marx.',
      longDescription: 'A equipe investiga como Marx interpreta as mudanças históricas, as relações entre classes sociais e os conflitos que estruturam a sociedade. O episódio foi pensado para aproximar conceitos centrais da filosofia política marxiana da experiência contemporânea, mantendo o formato de programa de rádio proposto para o trabalho.',
      image: 'imagens/episodios/marx.png',
      philosopherImage: 'imagens/filosofos/marx.png',
      fallbackImage: 'imagens/placeholders/marx.svg',
      color: '#9E2636',
      accentSoft: '#D25B68',
      period: '1818–1883',
      region: 'Europa',
      biography: 'Filósofo, economista e crítico da sociedade industrial do século XIX. Seu pensamento examinou as relações entre produção, classes sociais, poder e transformação histórica.',
      themes: ['Sociedade', 'Política', 'Poder'],
      concepts: ['Dialética', 'Luta de classes', 'Materialismo histórico', 'Alienação', 'Mais-valia'],
      works: ['O Capital', 'Manifesto do Partido Comunista', 'A Ideologia Alemã'],
      historicalContext: 'Século XIX, expansão do capitalismo industrial europeu, urbanização acelerada e crescimento do trabalho assalariado.',
      durationLabel: 'duas versões',
      audios: [
        {
          id: 'marx-short',
          label: 'Versão curta',
          durationLabel: 'menos de 20 min',
          file: 'audios/marx/episodio-curto.mp3',
          available: true
        },
        {
          id: 'marx-full',
          label: 'Versão completa',
          durationLabel: 'aprox. 1 hora',
          file: 'audios/marx/episodio-completo.mp3',
          available: true
        }
      ],
      script: {
        type: 'pdf',
        path: 'roteiros/marx/roteiro.pdf',
        available: true
      },
      members: [
        { name: 'Cauã Maurício dos Santos N. Miranda', role: 'Repórter e representante dos ouvintes' },
        { name: 'Diogo Vitorino Cardoso Oliveira', role: 'Narrador em off' },
        { name: 'Enzo Braga Martins', role: 'Karl Marx (convidado)' },
        { name: 'Ítalo de Carvalho Costa', role: 'Radialista e locutor comercial' },
        { name: 'Marina Prado Amorim', role: 'Co-host e entrevistadora' },
        { name: 'Mary Vitória Brito Batista', role: 'Âncora e apresentadora principal' },
        { name: 'Pedro Henrique Teixeira Pião', role: 'Sonoplasta e produtor musical' }
      ]
    },
    {
      id: 'locke',
      number: '02',
      group: 2,
      philosopher: 'John Locke',
      shortName: 'Locke',
      title: 'Liberdade, Propriedade e o Contrato Social',
      description: 'Direitos individuais, consentimento, propriedade e limites do governo entram em debate a partir do pensamento político de John Locke.',
      longDescription: 'O episódio apresenta os eixos políticos associados a John Locke, com atenção à liberdade, aos direitos, à propriedade e ao consentimento dos governados. A proposta é transformar esses conceitos em uma entrevista radiofônica clara, crítica e conectada a problemas de vida pública.',
      image: 'imagens/episodios/locke.png',
      philosopherImage: 'imagens/filosofos/locke.png',
      fallbackImage: 'imagens/placeholders/locke.svg',
      color: '#65713B',
      accentSoft: '#98A660',
      period: '1632–1704',
      region: 'Inglaterra',
      biography: 'Filósofo inglês associado ao liberalismo político moderno. Discutiu direitos naturais, consentimento político, propriedade e limites legítimos do poder governamental.',
      themes: ['Liberdade', 'Estado', 'Sociedade'],
      concepts: ['Direitos naturais', 'Liberdade', 'Propriedade', 'Consentimento', 'Contrato social'],
      works: ['Segundo Tratado sobre o Governo', 'Carta sobre a Tolerância', 'Ensaio sobre o Entendimento Humano'],
      historicalContext: 'Inglaterra dos séculos XVII e XVIII, marcada por disputas entre monarquia, Parlamento, religião e novas concepções de governo civil.',
      durationLabel: '17 min',
      audios: [
        {
          id: 'locke-main',
          label: 'Episódio',
          durationLabel: '17 min',
          file: 'audios/locke/episodio-02.mp3',
          available: true
        }
      ],
      script: { type: 'pdf', path: 'roteiros/locke/roteiro.pdf', available: true },
      members: [
        { name: 'Anna Lívia Guimarães Magalhães', role: 'John Locke (convidado)' },
        { name: 'Ellis Carvalho Xavier', role: 'Co-host / Entrevistadora de apoio e Repórter de rua / Participação do público' },
        { name: 'Geovanna Alves da Silva Ribeiro', role: 'Narradora / Contexto histórico ' },
        { name: 'João Pedro Bastos da Silva', role: 'Âncora / Apresentador' },
        { name: 'Kelvin Stanley Cruz Fernandes', role: 'Radialista / Quadro de rádio “A Voz do Contrato”' },
        { name: 'Talles Afonso de Souza', role: 'Sonoplasta / Produtor de arquivo sonoro e participação técnica no ar ' }
      ]
    },
    {
      id: 'hobbes',
      number: '03',
      group: 3,
      philosopher: 'Thomas Hobbes',
      shortName: 'Hobbes',
      title: 'O Estado de Natureza e o Leviatã',
      description: 'Medo, segurança, soberania e contrato político orientam uma conversa sobre por que os indivíduos aceitam um poder comum.',
      longDescription: 'Partindo do problema da segurança e da ordem, o episódio explora o estado de natureza, o contrato e a soberania em Hobbes. A equipe poderá confrontar o pensador com questões atuais sobre autoridade, conflito e limites da obediência política.',
      image: 'imagens/episodios/hobbes.png',
      philosopherImage: 'imagens/filosofos/hobbes.png',
      fallbackImage: 'imagens/placeholders/hobbes.svg',
      color: '#4A6577',
      accentSoft: '#7894A6',
      period: '1588–1679',
      region: 'Inglaterra',
      biography: 'Filósofo inglês que formulou uma teoria política centrada na necessidade de um poder soberano capaz de conter o conflito e garantir segurança comum.',
      themes: ['Estado', 'Poder', 'Sociedade'],
      concepts: ['Estado de natureza', 'Leviatã', 'Soberania', 'Contrato', 'Segurança'],
      works: ['Leviatã', 'Do Cidadão', 'Os Elementos da Lei'],
      historicalContext: 'Século XVII inglês, em um ambiente de guerras civis, disputas religiosas e conflitos sobre a autoridade política.',
      durationLabel: '15 min',
      audios: [
        {
          id: 'hobbes-main',
          label: 'Episódio',
          durationLabel: '15 min',
          file: 'audios/hobbes/episodio-03.mp3',
          available: true
        }
      ],
      script: { type: 'pdf', path: 'roteiros/hobbes/roteiro.pdf', available: true },
      members: [
        { name: 'Ágata Cristini Teixeira Martins', role: 'Narradora' },
        { name: 'Dayse Kelly Rodrigues Batista', role: 'Thomas Hobbes (convidado)' },
        { name: 'Francielly da Paz Souza', role: 'Radialista' },
        { name: 'Lorrani Rodrigues Costa', role: 'Comentarista' },
        { name: 'Sabrina Santana de Souza', role: 'Co-host / Entrevistadora de apoio' },
        { name: 'Vinícius Pires Silveira', role: 'Repórter / Ouvinte' },
        { name: 'Yasmin Andrade Souza', role: 'Âncora / Apresentadora' }
      ]
    },
    {
      id: 'rawls',
      number: '04',
      group: 4,
      philosopher: 'John Rawls',
      shortName: 'Rawls',
      title: 'A Justiça como Equidade',
      description: 'Uma investigação sobre justiça, igualdade, liberdades básicas e critérios para pensar instituições sociais mais justas.',
      longDescription: 'O episódio apresenta a teoria da justiça como equidade e suas ferramentas conceituais. A conversa pode mostrar como Rawls propõe pensar regras sociais sem saber de antemão qual posição cada pessoa ocupará na sociedade.',
      image: 'imagens/episodios/rawls.png',
      philosopherImage: 'imagens/filosofos/rawls.png',
      fallbackImage: 'imagens/placeholders/rawls.svg',
      color: '#203A63',
      accentSoft: '#5577A8',
      period: '1921–2002',
      region: 'Estados Unidos',
      biography: 'Filósofo político norte-americano que renovou o debate contemporâneo sobre justiça, igualdade, liberdades e desenho das instituições sociais.',
      themes: ['Justiça', 'Liberdade', 'Sociedade'],
      concepts: ['Justiça como equidade', 'Posição original', 'Véu da ignorância', 'Liberdades básicas', 'Princípio da diferença'],
      works: ['Uma Teoria da Justiça', 'Liberalismo Político', 'Justiça como Equidade'],
      historicalContext: 'Debates políticos e acadêmicos do século XX sobre democracia liberal, desigualdade, direitos e critérios de justiça institucional.',
      durationLabel: '27 min',
      audios: [
        {
          id: 'rawls-main',
          label: 'Episódio',
          durationLabel: 'aprox. 27 min',
          file: 'audios/rawls/episodio-04.mp3',
          available: true
        }
      ],
      script: { type: 'pdf', path: 'roteiros/rawls/roteiro.pdf', available: true },
      members: [
        { name: 'Gabrielly Dias da Silva', role: 'Co-apresentadora ' },
        { name: 'Cinthia Nunes dos Anjos', role: 'Radialista / Quadro de curiosidades ' },
        { name: 'Lara Vitória Almeida Ferreira', role: 'Repórter / Ouvinte ' },
        { name: 'Erick Gustavo Costa Souza', role: 'John Rawls (convidado)' },
        { name: 'Gustavo Oliveira Tolentino', role: 'Âncora / Apresentador' },
        { name: 'Paulo Gabriel W. Puga Silva', role: '' },
        { name: 'Gleimerson Rodrigo Guimarães', role: 'Narrador em Off ' }
      ]
    },
    {
      id: 'maquiavel',
      number: '05',
      group: 5,
      philosopher: 'Nicolau Maquiavel',
      shortName: 'Maquiavel',
      title: 'O Poder e o Príncipe',
      description: 'Poder, conflito, virtù, fortuna e preservação do Estado aparecem em uma entrevista sobre a política como ela acontece no mundo real.',
      longDescription: 'A equipe conduz uma conversa sobre poder e ação política a partir de Maquiavel, relacionando suas análises sobre liderança, conflito, estabilidade e circunstâncias históricas ao formato de entrevista radiofônica.',
      image: 'imagens/episodios/maquiavel.png',
      philosopherImage: 'imagens/filosofos/maquiavel.png',
      fallbackImage: 'imagens/placeholders/maquiavel.svg',
      color: '#7B2332',
      accentSoft: '#B84B5A',
      period: '1469–1527',
      region: 'Florença, Itália',
      biography: 'Pensador e diplomata florentino conhecido por analisar o poder político a partir das condições concretas da vida pública, dos conflitos e das escolhas dos governantes.',
      themes: ['Poder', 'Estado', 'Política'],
      concepts: ['Poder', 'Virtù', 'Fortuna', 'Estado', 'Realismo político'],
      works: ['O Príncipe', 'Discursos sobre a Primeira Década de Tito Lívio', 'A Arte da Guerra'],
      historicalContext: 'Renascimento italiano, marcado por cidades-Estado, guerras, alianças instáveis e disputas intensas pelo poder.',
      durationLabel: '9 min',
      audios: [
        {
          id: 'maquiavel-main',
          label: 'Episódio',
          durationLabel: '9 min',
          file: 'audios/maquiavel/episodio-05.mp3',
          available: true
        }
      ],
      script: { type: 'pdf', path: 'roteiros/maquiavel/roteiro.pdf', available: true },
      members: [
        { name: 'Luiz Augusto de Almeida Alves', role: '' },
        { name: 'Rogério de Cerri Ferreira da Silva', role: '' },
        { name: 'João Gabriel da Costa Leite', role: '' },
        { name: 'Sergio Octávio', role: '' },
        { name: 'Marlon Breno', role: '' },
        { name: 'Ítalo de Oliveira', role: '' }
      ]
    }
  ];

  const assignment = {
    title: 'Manual do Podcast de Filosofia Política',
    file: 'materiais-professor/manual-do-podcast-de-filosofia-politica.pdf',
    duration: '12 a 18 minutos',
    totalPoints: 30,
    blocks: [
      { number: '01', name: 'Abertura', detail: 'Vinheta, apresentação do tema e do pensador.', time: '1 min' },
      { number: '02', name: 'Contexto histórico', detail: 'Quem é o pensador, contexto, problema político e obra principal.', time: '2 min' },
      { number: '03', name: 'Entrevista', detail: 'Perguntas sobre conceitos, provocações e exemplos práticos.', time: '6–8 min' },
      { number: '04', name: 'Participação', detail: 'Repórter, carta ou ligação com uma pergunta difícil e atual.', time: '2 min' },
      { number: '05', name: 'Encerramento', detail: 'Última palavra do pensador e vinheta de despedida.', time: '2 min' }
    ],
    roles: [
      'Âncora / Apresentador',
      'O Pensador (Convidado)',
      'Co-host / Entrevistador de Apoio',
      'Repórter / Ouvinte',
      'Narrador em Off',
      'Radialista / Comercial',
      'Sonoplasta / Produtor Musical (grupos com 7 integrantes)'
    ],
    criteria: [
      { label: 'Domínio do conteúdo', points: 8 },
      { label: 'Roteiro e estrutura', points: 5 },
      { label: 'Aprofundamento e reflexão', points: 6 },
      { label: 'Aplicação prática e atualização', points: 4 },
      { label: 'Criatividade e produção', points: 4 },
      { label: 'Postura e oralidade', points: 3 }
    ]
  };

  window.APP_DATA = { site, episodes, assignment };
})();
