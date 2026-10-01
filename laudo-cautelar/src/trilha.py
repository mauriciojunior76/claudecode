"""Trilha original de suspense (sem direitos autorais), sincronizada com os cortes das cenas.

Elementos: drone grave + tique de relógio desde o 1º frame, batida de "coração" a partir da 2ª cena,
baixo pulsante no desenvolvimento, impacto em cada corte, "riser" antes dos cortes principais,
pausa seca antes da virada e acorde maior no CTA.

Uso: python3 src/trilha.py build/cenas.json build/trilha.wav
"""
import json
import sys
import wave

import numpy as np

SR = 48000
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(7)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def kick(gain=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / 0.04)
    return gain * np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.12)


def tick(gain=1.0):
    n = int(0.03 * SR)
    noise = np.diff(rng.standard_normal(n + 1))  # passa-alta simples
    return gain * noise * env_exp(n, 0.004)


def impacto(gain=1.0):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    f = 30 + 70 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.5)
    ruido = lowpass(rng.standard_normal(n), 2500) * env_exp(n, 0.12) * 0.8
    return gain * (boom + ruido)


def riser(dur, gain=1.0):
    n = int(dur * SR)
    ramp = np.linspace(0, 1, n) ** 2.5
    noise = np.diff(rng.standard_normal(n + 1)) * 0.35
    t = np.arange(n) / SR
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1400 * ramp) / SR) * 0.15
    return gain * (noise + sweep) * ramp


def tom(freqs, dur, gain, harm=4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for h in range(1, harm + 1):
            s += np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28)) / h
    return gain * s / len(freqs)


def add(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def gerar(duracoes):
    cortes = np.cumsum([0, *duracoes])
    total = cortes[-1]
    n = int(total * SR)
    mix = np.zeros(n)
    t = np.arange(n) / SR
    n_cenas = len(duracoes)
    virada = cortes[-3]  # penúltima cena (a frase de impacto antes do CTA)
    cta = cortes[-2]

    # drone grave (Lá 55 Hz + quinta) com tremolo lento; some no CTA para dar lugar ao acorde maior
    drone = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t) + 0.25 * np.sin(2 * np.pi * 110 * t))
    drone *= 0.18 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.5 * t))
    drone *= np.clip(t / 0.3, 0, 1) * np.where(t < cta, 1, np.clip(1 - (t - cta) / 0.4, 0, 1))
    mix += drone

    # tique de relógio no contratempo desde o 1º frame (tensão imediata)
    for b in np.arange(0, total, BEAT):
        add(mix, tick(0.35 if b < cortes[1] else 0.22), b)
        add(mix, tick(0.12), b + BEAT / 2)

    # batida de coração a partir da 2ª cena (kick em todo tempo, mais forte no 1 e no 3)
    for k, b in enumerate(np.arange(cortes[1], total - 0.6, BEAT)):
        if virada - 0.3 <= b < virada:
            continue
        add(mix, kick(0.9 if k % 2 == 0 else 0.6), b)

    # baixo pulsante em colcheias (Lá, Lá, Dó, Si) no desenvolvimento
    notas = [55, 55, 65.4, 61.7]
    for k, b in enumerate(np.arange(cortes[2], virada - 0.3, BEAT / 2)):
        nota = notas[(k // 4) % 4]
        s = tom([nota], BEAT / 2 * 0.9, 0.16, harm=6) * env_exp(int(BEAT / 2 * 0.9 * SR), 0.12)
        add(mix, s, b)

    # pad em acorde maior (Lá maior) no CTA: sensação de solução
    pad_dur = total - cta
    pad = tom([220, 277.2, 329.6, 440], pad_dur, 0.11, harm=3)
    pn = len(pad)
    pad *= np.clip(np.arange(pn) / (0.6 * SR), 0, 1) * np.clip((pn - np.arange(pn)) / (1.2 * SR), 0, 1)
    add(mix, lowpass(pad, 1800), cta)

    # impacto logo no 1º frame: segura quem está rolando o feed
    add(mix, impacto(1.0), 0)

    # impacto em cada corte; riser antes dos cortes mais importantes
    principais = {1, 3, n_cenas - 2, n_cenas - 1}
    for k in range(1, n_cenas):
        c = cortes[k]
        if k in principais:
            add(mix, riser(0.8, 0.5), c - 0.8)
        add(mix, impacto(0.9 if k in principais else 0.45), c)

    # pausa seca antes da virada: corta tudo por 0,25 s e volta no impacto
    a, b = int((virada - 0.25) * SR), int(virada * SR)
    mix[a:b] *= np.linspace(1, 0, b - a) ** 3
    add(mix, impacto(1.1), virada)

    # fade-out final
    fo = int(1.0 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo)

    # estéreo leve: atraso de 12 ms no canal direito para o tique/pad abrir
    d = int(0.012 * SR)
    left = mix
    right = np.concatenate([np.zeros(d), mix[:-d]]) * 0.9 + mix * 0.1
    st = np.stack([left, right], axis=1)
    st = np.tanh(st * 1.2)  # saturação suave
    st /= np.max(np.abs(st)) / 0.95
    return st


def salvar(st, caminho):
    pcm = (st * 32767).astype("<i2")
    with wave.open(caminho, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    cenas = json.load(open(sys.argv[1]))
    salvar(gerar([c["dur"] for c in cenas]), sys.argv[2])
    print("ok", sys.argv[2])
