export const galleryData = [
  {
    id: '2nd-gen',
    banner: '/assets/images/gallery-2nd-gen-banner.webp',
    title: 'Esta é a 2ª geração do noteous',
    description: 'Orbs. donut design. orblend engine. Há muito para explorar',
    images: [
      { src: '/assets/images/greeting-donut.webp', alt: 'donut design', caption: 'O novo donut design é delicioso e inovador. Desde quando você abre o noteous você percebe que há uma atenção especial aos detalhes'},
      { src: '/assets/images/greeting-orblend-engine.webp', alt: 'Orblend Engine', caption: 'O orblend engine é a inteligência por trás do noteous. Ele habilita uma série de recursos úteis, além de criar os Orbs, que aumentam a organização'},
      { src: '/assets/images/greeting-orbs.webp', alt: 'Orbs', caption: 'Os Orbs são uma novidade da 2ª Geração. É uma forma de organizar suas notas. Por exemplo, as notas concluídas ficam em um Orb específico delas. E no futuro será possível desbloquear novas cores de Orbs'}
    ]
  },
  {
    id: 'v2.4.2',
    banner: '/assets/images/gallery-v242.webp',
    title: 'noteous preview 2.4.2',
    latest: true,
    description: 'Orblend Engine modular, e uma série de melhorias',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.4.2-preview',
    images: [
      { src: '/assets/images/greeting-orblend-engine-modular.webp', alt: 'Orblend engine com modular', caption: 'O Orblend Engine foi reestruturado em módulos, deixando a base do noteous mais preparada para evoluir. Esse é mais um passo da nova arquitetura, lançada no noteous preview 2.4', type: 'Nova arquitetura' },
      { src: '/assets/images/greeting-orbs-design.webp', alt: 'Refinamento dos Orbs', caption: 'Nessa atualização, os orbs recebem um refinamento no design', type: 'Orbs' },
      { caption: 'Uma série de melhorias de experiência foi realizada, como o novo formato de exibição da data das notas, redesenhado de dentro para fora', type: 'Melhorias' }
    ]
  },
  {
    id: 'v2.4.1',
    banner: '/assets/images/gallery-v241.webp',
    title: 'noteous preview 2.4.1',
    description: 'Uma melhoria no tema',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.4.1-preview',
    images: [
      { caption: 'Nessa atualização, em navegadores compatíveis, a barra de título recebe a cor do tema escolhido (claro/escuro). Além disso, a Galeria de Atualizações do noteous preview agora estará no tema escuro', type: 'Tema' },
    ]
  },
  {
    id: 'v2.4',
    banner: '/assets/images/gallery-v24.webp',
    title: 'noteous preview 2.4',
    description: 'Nova arquitetura interna com módulos ES6, notas no IndexedDB e a Galeria de Atualizações com donut design e acesso aos bastiCodes e Releases do GitHub. Essa é uma atualização que prepara o noteous para o futuro',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.4-preview',
    images: [
      { src: '/assets/images/greeting-es6modules.webp', alt: 'Atualização 2.4',
      caption: 'A arquitetura de código do noteous foi reimaginada. Com o suporte a módulos ES6, é possível organizar e otimizar melhor o código além de reutilizar funções em vários locais diferentes', type: 'NOVO' },
      { src: '/assets/images/greeting-indexeddb.webp', alt: 'IndexedDB', caption: 'As notas agora são armazenadas usando a tecnologia IndexedDB, ao invés de LocalStorage. Isso prepara o noteous para o futuro', type: 'NOVO' },
      { caption: 'A Galeria de Atualizações recebeu o donut design, mais detalhes sobre as atualizações e também links diretos para acessar as Releases no GitHub, além dos bastiCodes, um formato de vídeo onde são mostrados os bastidores por trás do código (quando disponível)', type: 'Galeria de Atualizações' }
    ]
  },
  {
    id: 'v2.3',
    banner: '/assets/images/gallery-v23.webp',
    title: 'noteous preview 2.3',
    description: 'Smart Calc, Orb Links. Mais inteligência com donut design',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.3-preview',
    images: [
      { src: '/assets/images/greeting-smart-calc.webp', alt: 'Smart Calc', caption: 'O Smart Calc é uma nova capacidade do orblend engine, que ampliou o que um aplicativo de notas pode fazer. Basta escrever uma conta e o resultado aparece na hora', type: 'Novo' },
      { src: '/assets/images/greeting-orb-links.webp', alt: 'Orb Links', caption: 'Um novo Orb foi adicionado. Todos os links que forem salvos vão aparecer de forma separada no Orb Links', type: 'Novo Orb' },
      { src: '/assets/images/greeting-design.webp', alt: 'donut design', caption: 'Nessa atualização, o donut design recebeu grandes melhorias, com novas animações, e novos padrões para organizar os elementos da interface', type: 'donut design' }

    ]
  },
  {
    id: 'v2.2.1',
    banner: '/assets/images/gallery-v221.webp',
    title: 'noteous preview 2.2.1',
    description: 'Pequenos detalhes que fazem a diferença',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.2.1-preview',
    basticodes: 'https://youtu.be/MnMIs_mWQ6Q',
    images: [
      { caption: 'Essa atualização focou em várias melhorias de experiência. Assista ao bastiCodes para conferir os detalhes', type: 'MELHORIAS' }
    ]
  },
  {
    id: 'v2.2',
    banner: '/assets/images/gallery-v22.webp',
    title: 'noteous preview 2.2',
    description: 'Data das notas, atualização no orblend engine',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.2-preview',
    basticodes: 'https://youtu.be/LlkugEaJOI0',
    images: [
      { caption: 'Essa atualização trouxe de volta a informação de data de criação e edição às notas, uma atualização no orblend engine e mais. Assista ao bastiCodes para conferir os detalhes', type: 'MELHORIAS' }
    ]
  },
  {
    id: 'v2.1',
    banner: '/assets/images/gallery-v21.webp',
    title: 'noteous preview 2.1',
    description: 'Ícone da 2ª Geração do noteous preview, Central de Recursos. Galeria de Atualizações. Várias primeiras novidades',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.1-preview',
    images: [
      { src: '/assets/images/greeting-update.webp', alt: 'Design 2.1', caption: 'Essa foi a primeira grande atualização da 2ª Geração do noteous preview. Como destaques, trouxe um ícone atualizado, a Central de Recursos (antiga página Ajustes&Info) e também lançou a Galeria de Atualizações (antiga seção Histórico de Atualizações)', type: 'Várias novidades' }
    ]
  },
  {
    id: 'v2.0',
    banner: '/assets/images/gallery-v20.webp',
    title: 'noteous preview 2.0',
    description: 'O noteous preview 2.0 inaugurou a 2ª Geração, com os inovadores Orbs e o novo donut design',
    github: 'https://github.com/evertonruan/noteous/releases/tag/v2.0-preview',
    images: [
      
    ]
  }
]
