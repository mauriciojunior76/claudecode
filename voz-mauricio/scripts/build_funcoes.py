import subprocess, os
from PIL import Image, ImageDraw, ImageFont
U="/root/.claude/uploads/084c8e80-54dd-5d85-a405-4d8085e86fab/"
W=os.path.dirname(os.path.abspath(__file__))+"/"
im={1:"1cfbe3d3",2:"063e006f",3:"342f289c",4:"301fcba0",5:"1d7985ca",6:"331594cc",7:"f0363176",8:"4c051c46",9:"465a48cd",10:"277dd0b6",11:"5c0e0b8a",12:"2e0ce69b",13:"83f7963d",14:"aeebe65f"}
# (imagem, duração, legenda com *destaque*, direção zoom)
S=[
(1,4.5,"Quem conhece o *Marapé* em Santos vai *ADORAR* essa ideia de transformação!","in"),
(2,5.0,"O tradicional *Mercadinho do Marapé*, inaugurado em *1954* no Canal 1, com 17 lojas,","in"),
(3,4.0,"ganhou uma proposta *totalmente inovadora* de restauração","out"),
(1,5.0,"com novo design: *madeira ripada*, brise em madeira ecológica e *WPC*","out"),
(11,4.0,"e *áreas abertas* pra garantir conforto térmico,","in"),
(4,4.0,"para criar um clima *moderno* e muito *acolhedor.*","out"),
(12,4.5,"Agora o complexo terá um *pátio de convivência* ao ar livre,","in"),
(6,3.0,"um *estúdio de pilates*,","in"),
(9,3.0,"um *bar* bem convidativo,","out"),
(10,3.5,"um *restaurante* de dar água na boca,","in"),
(14,4.0,"além de departamentos da prefeitura como *IPTU* e *ISS*","out"),
(8,3.5,"e *escritórios* super bem montados.","in"),
(5,3.0,"Tudo focado no","out"),
(13,3.0,"*bem-estar* de quem vive no bairro!","in"),
]
CTA=(2,6.5)
FB="/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def F(s): return ImageFont.truetype(FB,s)
def caption_png(text,path,size=68):
    f=F(size); words=[]
    for tok in text.split(" "): pass
    # parse destaque
    hl=False; toks=[]
    for w in text.split(" "):
        h=hl
        if w.startswith("*"): hl=True; h=True; w=w[1:]
        if w.endswith("*"): hl=False; w=w[:-1]
        toks.append((w,h))
    d=ImageDraw.Draw(Image.new("RGBA",(10,10)))
    maxw=940; lines=[[]]; cur=0; sp=d.textlength(" ",font=f)
    for w,h in toks:
        l=d.textlength(w,font=f)
        if cur+l>maxw and lines[-1]: lines.append([]); cur=0
        lines[-1].append((w,h,l)); cur+=l+sp
    lh=int(size*1.28); H=lh*len(lines)+40
    img=Image.new("RGBA",(1080,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    for i,ln in enumerate(lines):
        tw=sum(l for _,_,l in ln)+sp*(len(ln)-1); x=(1080-tw)/2; y=20+i*lh
        for w,h,l in ln:
            d.text((x+3,y+5),w,font=f,fill=(0,0,0,150),stroke_width=7,stroke_fill=(0,0,0,150))
            d.text((x,y),w,font=f,fill=(255,212,0,255) if h else (255,255,255,255),stroke_width=7,stroke_fill=(0,0,0,255))
            x+=l+sp
    img.save(path)
    return H
def header_png(path):
    img=Image.new("RGBA",(1080,150),(0,0,0,0)); d=ImageDraw.Draw(img); f=F(34)
    t="PROJETO FASTPREV  •  COMO PODE FICAR"; tw=d.textlength(t,font=f)
    d.rounded_rectangle(((1080-tw)/2-34,30,(1080+tw)/2+34,100),radius=35,fill=(0,0,0,150))
    d.text(((1080-tw)/2,40),t,font=f,fill=(255,255,255,255)); img.save(path)
header_png(W+"cap/header.png")
def run(*a):
    r=subprocess.run(a,capture_output=True,text=True)
    if r.returncode: print(r.stderr[-1500:]); raise SystemExit(1)
def clip(n,i,dur,cap_img,cap_h,zin,extra=None):
    src=U+im[i]+"-image.jpg"; w,h=Image.open(src).size
    H=int(round(1080*h/w/2))*2; fr=int(dur*30)
    z="1.0+0.14*on/%d"%fr if zin=="in" else "1.14-0.14*on/%d"%fr
    fg=f"[3:v]scale=1620:-2,zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x{H}:fps=30[fg]"
    bg="[0:v]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=8:2,scale=1080:1920,eq=brightness=-0.2,format=yuv420p[bg]"
    py=(1920-H)//2-110
    cy=py+H+60
    fc=(f"{bg};{fg};[bg][fg]overlay=0:{py}[a];"
        f"[a][1:v]overlay=0:200[b];"
        f"[2:v]format=rgba,fade=in:st=0.15:d=0.3:alpha=1[c];[b][c]overlay=0:{cy}[o];"
        f"[o]fade=in:st=0:d=0.15,fade=out:st={dur-0.15}:d=0.15,format=yuv420p[v]")
    run("ffmpeg","-y","-loop","1","-t",str(dur),"-i",src,"-loop","1","-t",str(dur),"-i",W+"cap/header.png",
        "-loop","1","-t",str(dur),"-i",cap_img,"-i",src,"-filter_complex",fc,"-map","[v]","-r","30","-c:v","libx264","-preset","veryfast","-crf","20",W+f"clips/{n:02d}.mp4")
paths=[]
for n,(i,dur,t,z) in enumerate(S):
    p=W+f"cap/{n:02d}.png"; h=caption_png(t,p); clip(n,i,dur,p,h,z); paths.append(W+f"clips/{n:02d}.mp4")
# CTA
i,dur=CTA
img=Image.new("RGBA",(1080,600),(0,0,0,0)); d=ImageDraw.Draw(img)
d.rounded_rectangle((40,0,1040,580),radius=48,fill=(10,10,10,215))
def ct(y,t,s,c=(255,255,255)):
    f=F(s); d.text(((1080-d.textlength(t,font=f))/2,y),t,font=f,fill=c)
ct(40,"Projeto assinado por",40,(210,210,210)); ct(95,"FastPrev Projetos",84,(255,212,0))
ct(225,"Quer conhecer mais sobre nós?",44); ct(300,"Chame no WhatsApp",44)
ct(370,"(13) 97410-6538",76,(255,212,0)); ct(470,"Mauricio Júnior",44); ct(520,"Imagens ilustrativas de projeto futuro",26,(170,170,170))
img.save(W+"cap/cta.png")
src=U+im[i]+"-image.jpg"; w,h=Image.open(src).size; H=int(round(1080*h/w/2))*2; fr=int(dur*30)
fc=(f"[0:v]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=8:2,scale=1080:1920,eq=brightness=-0.3,format=yuv420p[bg];"
    f"[2:v]scale=1620:-2,zoompan=z='1.1-0.1*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x{H}:fps=30[fg];"
    f"[bg][fg]overlay=0:230[a];[1:v]format=rgba,fade=in:st=0.2:d=0.4:alpha=1[c];[a][c]overlay=0:{230+H+70}[o];"
    f"[o]fade=in:st=0:d=0.15,fade=out:st={dur-0.3}:d=0.3,format=yuv420p[v]")
run("ffmpeg","-y","-loop","1","-t",str(dur),"-i",src,"-loop","1","-t",str(dur),"-i",W+"cap/cta.png","-i",src,"-filter_complex",fc,"-map","[v]","-r","30","-c:v","libx264","-preset","veryfast","-crf","20",W+"clips/99.mp4")
paths.append(W+"clips/99.mp4")

# INTRO ANTES
d_i=3.8; fr=int(d_i*30)
pill=Image.new("RGBA",(1080,160),(0,0,0,0)); dd=ImageDraw.Draw(pill); ff=F(64); t="ANTES"
tw=dd.textlength(t,font=ff); dd.rounded_rectangle(((1080-tw)/2-50,10,(1080+tw)/2+50,120),radius=55,fill=(200,30,30,235)); dd.text(((1080-tw)/2,22),t,font=ff,fill=(255,255,255,255)); pill.save(W+"cap/antes.png")
ch=caption_png("Assim está hoje o *Mercadinho do Marapé...*",W+"cap/intro.png",72)
fc=(f"[0:v]scale=1620:-2,crop=w=ih*9/16:h=ih:x=40:y=0,zoompan=z='1.0+0.1*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps=30,eq=brightness=-0.05[fg];"
    f"[fg][1:v]overlay=0:230[a];[a][2:v]overlay=0:1330[o];"
    f"[o]fade=in:st=0:d=0.15,fade=out:st={d_i-0.12}:d=0.12:color=white,format=yuv420p[v]")
run("ffmpeg","-y","-i",W+"antes.png","-loop","1","-t",str(d_i),"-i",W+"cap/antes.png","-loop","1","-t",str(d_i),"-i",W+"cap/intro.png","-filter_complex",fc,"-map","[v]","-r","30","-c:v","libx264","-preset","veryfast","-crf","20",W+"clips/intro.mp4")
paths.insert(0,W+"clips/intro.mp4")
open(W+"list.txt","w").write("".join(f"file '{p}'\n" for p in paths))
total=sum(s[1] for s in S)+CTA[1]+d_i
run("ffmpeg","-y","-f","concat","-safe","0","-i",W+"list.txt","-f","lavfi","-i","anullsrc=r=44100:cl=stereo","-vf",
    f"drawbox=x=0:y=1890:w='1080*t/{total}':h=10:color=0xFFD400@1:t=fill","-t",str(total),
    "-c:v","libx264","-preset","medium","-crf","20","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-shortest","-movflags","+faststart",W+"reel_marape.mp4")
print("ok",total)
