// Versão para CONSTRUTORAS e INCORPORADORAS: Reels + 1 carrossel.
// Gerar: node src/render.mjs content_construtoras.mjs && python3 src/build_video.py reels_construtoras.mp4

export const WHATSAPP = '(13) 97410-6538';
export const CONTATO = 'Mauricio Júnior';
export const HANDLE = '@mauricio_fastprev';

export const carrosseis = [
  {
    pasta: 'carrossel-4-construtoras',
    slides: [
      {
        tipo: 'capa', foto: 'obra_drone.jpg',
        kicker: 'Para construtoras e incorporadoras',
        titulo: 'Um vizinho pode [[parar a sua obra.]]',
        sub: 'Como o laudo cautelar protege prazo, caixa e reputação.',
      },
      {
        tipo: 'texto', foto: 'rachadura.jpg',
        titulo: 'O roteiro que [[atrasa cronograma]]',
        texto: 'O vizinho alega que a trinca veio da sua obra. Chega notificação, pedido de perícia, o jurídico entra e a equipe para pra se defender. Sem registro do “antes”, a conta é da construtora.',
      },
      {
        tipo: 'cards',
        titulo: 'O que você [[protege]]',
        texto: 'Um laudo antes da primeira estaca evita:',
        cards: [
          { icone: 'estaca', t: 'Prazo', d: 'Obra parada por reclamação ou embargo' },
          { icone: 'documento', t: 'Caixa', d: 'Reparo de dano que já existia' },
          { icone: 'martelo', t: 'Jurídico', d: 'Processo sem prova técnica a seu favor' },
          { icone: 'predio', t: 'Reputação', d: 'Conflito com a vizinhança do empreendimento' },
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Como a FastPrev [[atende construtoras]]',
        texto: 'Do primeiro imóvel da divisa ao relatório final:',
        itens: ['Vistoria de todos os imóveis da divisa', 'Fotos datadas de cada ambiente', 'Relatório técnico com ART', 'Atendimento para várias obras', 'Agenda alinhada ao seu cronograma', 'Documento pronto pra usar como prova'],
      },
      {
        tipo: 'texto', foto: 'justica.jpg',
        titulo: 'O seu “antes” vira [[prova técnica]]',
        texto: 'Se alguém alegar que a obra causou um dano que já existia, a construtora tem fotos, data e assinatura técnica pra se defender.',
      },
      {
        tipo: 'cta',
        titulo: 'Próxima obra no cronograma? [[Fale com a FastPrev antes de cavar.]]',
        texto: 'Laudo cautelar de vizinhança para construtoras e incorporadoras.',
      },
    ],
  },
];

export const cenas = [
  { dur: 3.0, fundo: 'preto', camadas: [
    { em: 0.0, html: '<p class="v-hook">Sua construtora vai começar <b>obra nova?</b></p>' },
  ]},
  { dur: 3.0, fundo: 'foto', foto: 'rachadura.jpg', camadas: [
    { em: 0.0, html: '<p class="v-big">Um único vizinho pode <mark>parar tudo.</mark></p>' },
  ]},
  { dur: 5.0, fundo: 'claro', camadas: [
    { em: 0.0, html: '<p class="v-mid dark">Ele alega que a trinca veio da <span class="blue">sua obra.</span></p>' },
    { em: 1.0, html: '<div class="v-check"><span>1</span>Notificação</div>' },
    { em: 1.7, html: '<div class="v-check c2"><span>2</span>Perícia e jurídico</div>' },
    { em: 2.4, html: '<div class="v-check c3"><span>3</span>Cronograma atrasado</div>' },
  ]},
  { dur: 4.2, fundo: 'foto', foto: 'obra_drone.jpg', camadas: [
    { em: 0.0, html: '<p class="v-kicker">A solução</p><p class="v-big">Laudo cautelar de <mark>vizinhança</mark></p>' },
    { em: 1.6, html: '<p class="v-sub">Cada imóvel da divisa registrado <b>antes da primeira estaca.</b></p>' },
  ]},
  { dur: 4.4, fundo: 'claro', camadas: [
    { em: 0.0, html: '<p class="v-mid dark">Feito pra rotina de construtora:</p>' },
    { em: 0.6, html: '<div class="v-check"><span>✓</span>Fotos datadas</div>' },
    { em: 1.3, html: '<div class="v-check c2"><span>✓</span>Relatório com ART</div>' },
    { em: 2.0, html: '<div class="v-check c3"><span>✓</span>Várias obras ao mesmo tempo</div>' },
  ]},
  { dur: 3.6, fundo: 'foto', foto: 'justica.jpg', camadas: [
    { em: 0.0, html: '<p class="v-big sm">Se alguém alegar um dano que já existia, o seu “antes” vira <mark>prova técnica.</mark></p>' },
  ]},
  { dur: 2.8, fundo: 'preto', camadas: [
    { em: 0.0, html: '<p class="v-final" style="font-size:100px">Prazo protegido. <b>Obra andando.</b></p>' },
  ]},
  { dur: 5.0, fundo: 'cta', camadas: [
    { em: 0.0, html: '<p class="v-kicker yellow">FastPrev · Engenharia</p><p class="v-big">Laudo cautelar para <mark class="y">construtoras</mark></p>' },
    { em: 1.2, html: '<div class="v-pill">WhatsApp __WHATS__ · __CONTATO__</div><p class="v-handle">__HANDLE__</p>' },
  ]},
];
