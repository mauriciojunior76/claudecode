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
