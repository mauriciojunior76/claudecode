# Laudo cautelar de vizinhança: Reels + 3 carrosséis

Tudo gira em torno do gancho **"laudo cautelar de vizinhança"**.

| Peça | Arquivo | Formato |
|---|---|---|
| Reels (texto animado + fotos) | `reels/reels_laudo_cautelar.mp4` | 1080×1920, 33 s, H.264, áudio mudo |
| Carrossel 1: Antes x Depois do problema | `carrossel-1-antes-x-depois/01..05.png` | 1080×1350 (4:5) |
| Carrossel 2: 3 erros que custam caro | `carrossel-2-3-erros/01..05.png` | 1080×1350 (4:5) |
| Carrossel 3: Passo a passo do laudo | `carrossel-3-passo-a-passo/01..06.png` | 1080×1350 (4:5) |

---

## 🎬 Roteiro do Reels (≈33 s)

O vídeo pronto funciona sozinho (texto na tela + fotos). Para a versão com você falando,
grave o rosto nos trechos marcados com 🎥 e use o vídeo como B-roll/legenda por cima.

| Tempo | Tela (já no vídeo) | Fala |
|---|---|---|
| 0,0–3,2 s | Tela preta, corte seco: "Se sua obra começar **amanhã**… …e o vizinho abrir um **processo** depois?" | 🎥 *"Se sua obra começar amanhã, e o vizinho abrir um processo depois…"* |
| 3,2–6,2 s | Foto da rachadura: "Você tem como **PROVAR** que essa rachadura **JÁ EXISTIA?**" | 🎥 *"…você tem como provar que aquela rachadura já existia?"* (olhar fixo, sem sorriso) |
| 6,2–10,2 s | "A maioria dos donos de obra só pensa em documentação quando o problema já apareceu." + carimbo **AÍ É TARDE.** | *"A maioria dos donos de obra só pensa em documentação quando o problema já apareceu. Só que aí é tarde."* |
| 10,2–14,4 s | Foto da obra (drone): "**LAUDO CAUTELAR DE VIZINHANÇA**: registra o estado do imóvel ao lado antes da primeira estaca." | *"O laudo cautelar de vizinhança registra o estado do imóvel do lado…"* |
| 14,4–18,4 s | Checklist: ✓ Foto de cada ambiente ✓ Data do registro ✓ Assinatura técnica (ART) | *"…com foto, data e assinatura técnica, ANTES da primeira estaca."* |
| 18,4–22,0 s | Foto da estátua da Justiça: "Vira **PROVA TÉCNICA** se alguém tentar te culpar por um dano que já existia." | *"Isso vira prova técnica se alguém tentar te culpar por um dano que já existia."* |
| 22,0–25,8 s | Tela preta: "Sem esse laudo, não é você contra o vizinho. É a **sua palavra** contra a **dele**." | 🎥 *"Sem esse laudo, não é você contra o vizinho. É a sua palavra contra a dele."* |
| 25,8–28,4 s | "E QUEM NÃO TEM PROVA, **PERDE.**" | 🎥 *"E quem não tem prova, perde."* |
| 28,4–33,4 s | CTA: Manda **"LAUDO"** no direct + WhatsApp + @mauricio_fastprev | 🎥 *"Manda mensagem 'LAUDO' que eu te explico como funciona."* |

**Dicas de postagem**
- O áudio do arquivo é mudo de propósito. No Instagram, grave a narração por cima ou use um áudio em alta com volume baixo.
- Textos ficam fora da área coberta pelos botões do Reels (parte de baixo e lateral direita).
- Capa do Reels: o 1º frame já mostra o gancho.

**Legenda sugerida**

> Rachadura que já existia virou dor de cabeça pra quem não documentou antes. 🧱⚠️
> O laudo cautelar de vizinhança é o seguro que sua obra precisa ter antes do primeiro tijolo.
> 📩 Comenta "LAUDO" ou chama no direct.
> #construçãocivil #engenhariacivil #laudocautelar #regularizaçãodeimoveis #segurançadaobra

---

## 🖼️ Carrossel 1: "Antes x Depois do problema"
1. **Capa:** "A rachadura já estava lá. Só ninguém provou."
2. Sem laudo = palavra contra palavra (foto da parede trincada)
3. O que o laudo cautelar registra: fissuras, infiltrações, esquadrias, foto, data, ART
4. Quando ele te protege: obra ao lado, reforma, demolição, escavação
5. CTA: "Fala com a gente antes da primeira estaca" + WhatsApp

## 🖼️ Carrossel 2: "3 erros que custam caro"
1. **Capa:** "3 erros que colocam sua obra em risco jurídico"
2. Erro 01: Começar a obra sem registrar o estado do vizinho
3. Erro 02: Achar que "não vai dar problema"
4. Erro 03: Só procurar o laudo quando o processo já começou
5. CTA: "Evite os 3 erros. Fale com a FastPrev antes de cavar." + WhatsApp

## 🖼️ Carrossel 3: "Passo a passo do laudo cautelar"
1. **Capa:** "Como funciona o laudo cautelar de vizinhança"
2. Passo 1: Visita técnica aos imóveis vizinhos
3. Passo 2: Registro fotográfico datado
4. Passo 3: Relatório técnico com ART
5. Passo 4: Documento pronto pra usar como prova
6. CTA: "Sua obra começa amanhã? Fala com a gente hoje." WhatsApp · Mauricio Júnior

---

## Como editar e gerar de novo

Todos os textos, o telefone e o @ ficam em `src/content.mjs`.

```bash
cd laudo-cautelar
node src/render.mjs          # gera os PNGs dos carrosséis e as camadas do vídeo
python3 src/build_video.py   # monta o MP4 (precisa de ffmpeg ou: pip install imageio-ffmpeg)
```

Fotos em `assets/` (recortadas das artes originais). Fonte Inter embutida em `assets/fonts/`.

---

# 🏗️ Versão para construtoras e incorporadoras

| Peça | Arquivo |
|---|---|
| Reels para construtoras (31 s) | `reels/reels_construtoras.mp4` |
| Carrossel 4: Construtoras (6 slides) | `carrossel-4-construtoras/01..06.png` |

## Roteiro do Reels para construtoras

| Tempo | Tela | Fala |
|---|---|---|
| 0–3 s | "Sua construtora vai começar **obra nova?**" | 🎥 *"Sua construtora vai começar obra nova?"* |
| 3–6 s | Rachadura: "Um único vizinho pode **parar tudo.**" | *"Um único vizinho pode parar tudo."* |
| 6–11 s | "Ele alega que a trinca veio da sua obra" → 1 Notificação, 2 Perícia e jurídico, 3 Cronograma atrasado | *"Ele alega que a trinca foi causada pela sua obra. Vem notificação, perícia, jurídico… e o cronograma atrasa."* |
| 11–15 s | Drone: "Laudo cautelar de vizinhança, com cada imóvel da divisa registrado antes da primeira estaca" | *"O laudo cautelar de vizinhança registra cada imóvel da divisa antes da primeira estaca."* |
| 15–20 s | ✓ Fotos datadas ✓ Relatório com ART ✓ Várias obras ao mesmo tempo | *"Fotos datadas, relatório com ART e atendimento para várias obras ao mesmo tempo."* |
| 20–23 s | Justiça: "Seu 'antes' vira **prova técnica.**" | *"Se alguém alegar um dano que já existia, o seu antes vira prova técnica."* |
| 23–26 s | "Prazo protegido. **Obra andando.**" | 🎥 *"Prazo protegido, obra andando."* |
| 26–31 s | CTA: Laudo cautelar para construtoras + WhatsApp + @ | 🎥 *"Fale com a FastPrev antes da próxima obra. Chama no WhatsApp."* |

## Carrossel 4: Construtoras
1. **Capa:** "Um vizinho pode parar a sua obra."
2. O roteiro que atrasa cronograma
3. O que você protege: prazo, caixa, jurídico e reputação
4. Como a FastPrev atende construtoras
5. O seu "antes" vira prova técnica
6. CTA: "Próxima obra no cronograma? Fale com a FastPrev antes de cavar."

## Legenda para construtoras
> Construtora que começa obra sem laudo cautelar de vizinhança assume um risco que não precisa.
> Um vizinho alega trinca, a obra para, o jurídico entra, o cronograma atrasa.
> Com o laudo, cada imóvel da divisa fica registrado antes da primeira estaca: fotos datadas, relatório técnico e ART.
> 🏗️ Atendemos construtoras e incorporadoras na Baixada Santista.
> 📲 WhatsApp (13) 97410-6538 · Mauricio Júnior
> #construtora #incorporadora #engenhariacivil #laudocautelar #laudodevizinhança #obras #construçãocivil #santos #baixadasantista

Gerar de novo: `node src/render.mjs content_construtoras.mjs && python3 src/build_video.py reels_construtoras.mp4`
