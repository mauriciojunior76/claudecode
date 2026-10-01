"""Monta o Reels (1080x1920, 30fps, H.264/AAC) a partir das camadas geradas por render.mjs.

Uso (a partir de laudo-cautelar/): python3 src/build_video.py [nome_do_arquivo.mp4]
Requer ffmpeg no PATH ou `pip install imageio-ffmpeg`.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
OUT = ROOT / "reels" / (sys.argv[1] if len(sys.argv) > 1 else "reels_laudo_cautelar.mp4")
FPS = 30
FADE = 0.35  # entrada de cada camada de texto (fade + subida de 40px)

ffmpeg = shutil.which("ffmpeg")
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()


def run(args):
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


cenas = json.loads((BUILD / "cenas.json").read_text())
clips = []
for i, c in enumerate(cenas, 1):
    n = round(c["dur"] * FPS)
    inputs = ["-i", c["fundo"]]
    # fundo: zoom lento de 1.00 a 1.05 (renderizado em 2x para não tremer)
    fg = [f"[0]scale=2160:3840,zoompan=z='1+0.05*on/{n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={n}:s=1080x1920:fps={FPS}[v0]"]
    last = "v0"
    for k, cam in enumerate(c["camadas"], 1):
        inputs += ["-loop", "1", "-framerate", str(FPS), "-t", str(c["dur"]), "-i", cam["png"]]
        a = cam["em"]
        if i == 1 and a == 0:  # gancho: visível já no 1º frame (é o que aparece como capa no feed)
            fg.append(f"[{k}]format=rgba[t{k}]")
            fg.append(f"[{last}][t{k}]overlay=x=0:y=0:eof_action=pass[v{k}]")
        else:
            fg.append(f"[{k}]format=rgba,fade=t=in:st={a}:d={FADE}:alpha=1[t{k}]")
            fg.append(f"[{last}][t{k}]overlay=x=0:y='40*max(0,min(1,1-(t-{a})/{FADE}))':eof_action=pass[v{k}]")
        last = f"v{k}"
    clip = BUILD / f"cena_{i:02d}.mp4"
    run([*inputs, "-filter_complex", ";".join(fg), "-map", f"[{last}]", "-frames:v", str(n),
         "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), str(clip)])
    clips.append(clip)
    print("cena", i, "ok")

lista = BUILD / "lista.txt"
lista.write_text("".join(f"file '{p}'\n" for p in clips))
OUT.parent.mkdir(parents=True, exist_ok=True)
total = sum(c["dur"] for c in cenas)
# trilha original sincronizada com os cortes (src/trilha.py), normalizada para ~-14 LUFS (padrão do Instagram)
sys.path.insert(0, str(Path(__file__).parent))
import trilha
wav = BUILD / "trilha.wav"
trilha.salvar(trilha.gerar([c["dur"] for c in cenas]), str(wav))
run(["-f", "concat", "-safe", "0", "-i", str(lista), "-i", str(wav),
     "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
     "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUT)])
print("ok", OUT.relative_to(ROOT), f"{total:.1f}s")
