// Conteúdo dos 3 carrosséis e das cenas do Reels — "laudo cautelar de vizinhança".
// Para trocar o telefone, edite só WHATSAPP abaixo e rode `node src/render.mjs && python3 src/build_video.py`.

export const WHATSAPP = '(13) 97410-6538';
export const CONTATO = 'Mauricio Júnior';
export const HANDLE = '@mauricio_fastprev';

// Destaque em azul: use [[texto]] dentro de títulos.
export const carrosseis = [
  {
    pasta: 'carrossel-1-antes-x-depois',
    slides: [
      {
        tipo: 'capa', foto: 'rachadura.jpg',
        kicker: 'Laudo cautelar de vizinhança',
        titulo: 'A rachadura já estava lá. [[Só ninguém provou.]]',
        sub: 'O que todo dono de obra precisa saber antes de começar.',
      },
      {
        tipo: 'texto', foto: 'rachadura.jpg',
        titulo: 'Sem laudo = [[palavra contra palavra]]',
        texto: 'O vizinho diz que a trinca apareceu por causa da sua obra. Você diz que ela já existia. Sem um registro técnico feito antes, ninguém prova nada — e o custo do reparo pode sobrar pra você.',
      },
      {
        tipo: 'lista',
        titulo: 'O que o laudo cautelar [[registra]]',
        texto: 'O estado atual de cada imóvel vizinho, documentado antes da obra começar:',
        itens: ['Fissuras e trincas', 'Infiltrações e umidade', 'Esquadrias, pisos e revestimentos', 'Foto de cada ambiente', 'Data do registro', 'ART do engenheiro responsável'],
      },
      {
        tipo: 'cards',
        titulo: 'Quando ele [[te protege]]',
        texto: 'Sempre que a obra puder gerar vibração ou movimentar o solo:',
        cards: [
          { icone: 'predio', t: 'Obra ao lado', d: 'Construção nova com imóveis na divisa' },
          { icone: 'martelo', t: 'Reforma', d: 'Quebra de paredes, lajes e pisos' },
          { icone: 'demolicao', t: 'Demolição', d: 'Impacto e vibração nas estruturas vizinhas' },
          { icone: 'estaca', t: 'Escavação', d: 'Fundação, estacas e movimento de terra' },
        ],
      },
      {
        tipo: 'cta',
        titulo: 'Fala com a gente [[antes da primeira estaca]]',
        texto: 'Laudo cautelar de vizinhança com registro técnico completo. A gente documenta, você começa a obra tranquilo.',
      },
    ],
  },
  {
    pasta: 'carrossel-2-3-erros',
    slides: [
      {
        tipo: 'capa', foto: 'obra_drone.jpg',
        kicker: 'Laudo cautelar de vizinhança',
        titulo: '3 erros que colocam sua obra em [[risco jurídico]]',
        sub: 'O terceiro é o mais caro.',
      },
      {
        tipo: 'erro', numero: '01', foto: 'obra_drone.jpg',
        titulo: 'Começar a obra sem registrar o [[estado do vizinho]]',
        texto: 'Depois que a máquina entra, não dá pra voltar no tempo. O estado dos imóveis vizinhos precisa ser documentado antes da primeira escavação.',
      },
      {
        tipo: 'erro', numero: '02', foto: 'rachadura.jpg',
        titulo: 'Achar que [[“não vai dar problema”]]',
        texto: 'Estaca, escavação e demolição geram vibração. E mesmo quando a obra não causa nada, alguém pode alegar que causou.',
      },
      {
        tipo: 'erro', numero: '03', foto: 'justica.jpg',
        titulo: 'Só procurar o laudo quando o [[processo já começou]]',
        texto: 'Aí já não existe registro do “antes”. O laudo cautelar só protege de verdade se for feito antes da obra começar.',
      },
      {
        tipo: 'cta',
        titulo: 'Evite os 3 erros. [[Fale com a FastPrev antes de cavar.]]',
        texto: 'Um laudo feito hoje evita meses de dor de cabeça depois.',
      },
    ],
  },
  {
    pasta: 'carrossel-3-passo-a-passo',
    slides: [
      {
        tipo: 'capa', foto: 'justica.jpg',
        kicker: 'Passo a passo',
        titulo: 'Como funciona o [[laudo cautelar de vizinhança]]',
        sub: 'Do primeiro contato ao documento pronto.',
      },
      {
        tipo: 'passo', numero: 1, total: 4,
        titulo: 'Visita técnica aos [[imóveis vizinhos]]',
        texto: 'O engenheiro vai até os imóveis que fazem divisa com a sua obra e inspeciona cada ambiente, por dentro e por fora.',
        icone: 'predio',
      },
      {
        tipo: 'passo', numero: 2, total: 4, foto: 'rachadura.jpg',
        titulo: 'Registro fotográfico [[datado]]',
        texto: 'Cada fissura, mancha de umidade ou esquadria com defeito é fotografada e identificada, com data.',
      },
      {
        tipo: 'passo', numero: 3, total: 4,
        titulo: 'Relatório técnico [[com ART]]',
        texto: 'Tudo vira um relatório assinado pelo engenheiro responsável, com Anotação de Responsabilidade Técnica registrada no CREA.',
        icone: 'documento',
      },
      {
        tipo: 'passo', numero: 4, total: 4, foto: 'justica.jpg',
        titulo: 'Documento pronto pra usar [[como prova]]',
        texto: 'Se alguém alegar que a sua obra causou um dano que já existia, você tem o registro técnico do “antes” pra se defender.',
      },
      {
        tipo: 'cta',
        titulo: 'Sua obra começa amanhã? [[Fala com a gente hoje.]]',
        texto: 'Laudo cautelar de vizinhança antes da primeira estaca.',
      },
    ],
  },
];

// Cenas do Reels (1080x1920). `camadas` entram em sequência no tempo `em` (segundos dentro da cena).
export const cenas = [
  { dur: 3.2, fundo: 'preto', camadas: [
    { em: 0.0, html: '<p class="v-hook">Se sua obra começar <b>amanhã</b>…</p>' },
    { em: 1.3, html: '<p class="v-hook v-low">…e o vizinho abrir um <b>processo</b> depois?</p>' },
  ]},
  { dur: 3.0, fundo: 'foto', foto: 'rachadura.jpg', camadas: [
    { em: 0.0, html: '<p class="v-big">Você tem como <mark>provar</mark> que essa rachadura <mark>já existia?</mark></p>' },
  ]},
  { dur: 4.0, fundo: 'claro', camadas: [
    { em: 0.0, html: '<p class="v-mid dark">A maioria dos donos de obra só pensa em documentação quando o problema <span class="blue">já apareceu.</span></p>' },
    { em: 2.3, html: '<p class="v-stamp">Aí é tarde.</p>' },
  ]},
  { dur: 4.2, fundo: 'foto', foto: 'obra_drone.jpg', camadas: [
    { em: 0.0, html: '<p class="v-kicker">A solução</p><p class="v-big">Laudo cautelar de <mark>vizinhança</mark></p>' },
    { em: 1.6, html: '<p class="v-sub">Registra o estado do imóvel ao lado <b>antes da primeira estaca.</b></p>' },
  ]},
  { dur: 4.0, fundo: 'claro', camadas: [
    { em: 0.0, html: '<p class="v-mid dark">Tudo documentado com:</p>' },
    { em: 0.6, html: '<div class="v-check"><span>✓</span>Foto de cada ambiente</div>' },
    { em: 1.3, html: '<div class="v-check c2"><span>✓</span>Data do registro</div>' },
    { em: 2.0, html: '<div class="v-check c3"><span>✓</span>Assinatura técnica (ART)</div>' },
  ]},
  { dur: 3.6, fundo: 'foto', foto: 'justica.jpg', camadas: [
    { em: 0.0, html: '<p class="v-big sm">Vira <mark>prova técnica</mark> se alguém tentar te culpar por um dano que já existia.</p>' },
  ]},
  { dur: 3.8, fundo: 'preto', camadas: [
    { em: 0.0, html: '<p class="v-hook">Sem esse laudo, não é você contra o vizinho.</p>' },
    { em: 1.7, html: '<p class="v-hook v-low">É a <b>sua palavra</b> contra a <b>dele.</b></p>' },
  ]},
  { dur: 2.6, fundo: 'preto', camadas: [
    { em: 0.0, html: '<p class="v-final">E quem não tem prova, <b>perde.</b></p>' },
  ]},
  { dur: 5.0, fundo: 'cta', camadas: [
    { em: 0.0, html: '<p class="v-kicker yellow">Quer saber como funciona?</p><p class="v-big">Manda <mark class="y">“LAUDO”</mark> no direct</p>' },
    { em: 1.2, html: '<div class="v-pill">WhatsApp __WHATS__ · __CONTATO__</div><p class="v-handle">__HANDLE__</p>' },
  ]},
];
