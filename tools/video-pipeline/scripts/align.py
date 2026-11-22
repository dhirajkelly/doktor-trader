import json,re,subprocess,sys,os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
import script
SUBMAP=[("Enam belas dolar","$16"),('tiga ribu tujuh ratus empat puluh dua koma lima', '3.742,5'), ('lima ratus sembilan puluh sembilan dolar', '$599'), ('Turun lima puluh, dibagi sisa lima puluh', 'Turun 50, dibagi sisa 50'), ('tiga ribu tujuh ratus empat puluh lima', '3.745'), ('tiga ribu tujuh ratus tiga puluh lima', '3.735'), ('tiga ratus empat puluh sembilan dolar', '$349'), ('seratus delapan puluh tujuh persen', '187%'), ('sepuluh dibagi lima dibagi seratus', '10 ÷ 5 ÷ 100'), ('tiga ribu tujuh ratus empat puluh', '3.740'), ('tiga ratus tujuh puluh lima dolar', '$375'), ('Kebanyakan orang jawab lima puluh', 'Kebanyakan orang jawab 50'), ('tiga ribu tujuh ratus lima puluh', '3.750'), ('tiga ribu tujuh ratus tiga puluh', '3.730'), ('sembilan ratus lima puluh dolar', '$950'), ('Angka tiga dan sepuluh persen', 'Angka 3% dan 10%'), ('sembilan ratus empat dolar', '$904'), ('tujuh puluh lima persen', '75%'), ('enam puluh tujuh persen', '67%'), ('satu banding lima ratus', '1:500'), ('seribu dua ratus dolar', '$1.200'), ('tiga puluh tiga persen', '33%'), ('satu sampai dua persen', '1–2%'), ('sembilan ratus persen', '900%'), ('dua puluh lima persen', '25%'), ('sembilan puluh persen', '90%'), ('sembilan ratus dolar', '$900'), ('nol koma nol dua lot', '0,02 lot'), ('dhirajkelly dot i d', 'dhirajkelly.id'), ('nol koma empat lot', '0,4 lot'), ('empat puluh dolar', '$40'), ('tiga ratus persen', '300%'), ('lima puluh persen', '50%'), ('nol koma satu lot', '0,1 lot'), ('seribu dua ratus', '$1.200'), ('tiga ratus dolar', '$300'), ('lima ratus dolar', '$500'), ('lima puluh dolar', '$50'), ('enam belas dolar', '$16'), ('dua belas dolar', '$12'), ('sembilan ratus', '$900'), ('seratus persen', '100%'), ('sebelas persen', '11%'), ('sepuluh persen', '10%'), ('sepuluh dolar', '$10'), ('seribu dolar', '$1.000'), ('setengah lot', '0,5 lot'), ('sepuluh kali', '10 kali'), ('lima persen', '5%'), ('tiga persen', '3%'), ('satu persen', '1%'), ('lima dolar', '$5'), ('satu dolar', '$1'), ('dua dolar', '$2')]
def subify(t):
    for a,b in SUBMAP: t=t.replace(a,b)
    return t
def silences(f):
    r=subprocess.run(['ffmpeg','-i',f,'-af','silencedetect=noise=-38dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',r)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',r)]
    return list(zip(st,en))
out=[]
for s in script.SCENES:
    f=f"remotion/public/vo/{s['id']}.mp3"
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
    sil=silences(f)
    lead=sil[0][1] if sil and sil[0][0]<0.05 else 0.0
    tail=sil[-1][0] if sil and sil[-1][1]>dur-0.05 else dur
    inner=[x for x in sil if x[0]>0.05 and x[1]<dur-0.05]
    sents=[x.strip() for x in re.split(r'(?<=[.?!:])\s+(?=[A-Z0-9"])',s['vo']) if x.strip()]
    L=[len(x) for x in sents]; tot=sum(L)
    # expected boundary times
    exp=[];acc=0
    for l in L[:-1]:
        acc+=l; exp.append(lead+(tail-lead)*acc/tot)
    # DP: choose ordered subset of inner silences matching boundaries minimizing |mid-exp| (prefer longer pauses)
    import math
    n=len(exp); m=len(inner)
    INF=1e9; dp=[[INF]*(m+1) for _ in range(n+1)]; bk=[[None]*(m+1) for _ in range(n+1)]
    for j in range(m+1): dp[0][j]=0
    for i in range(1,n+1):
        for j in range(1,m+1):
            # skip silence j
            if dp[i][j-1]<dp[i][j]: dp[i][j]=dp[i][j-1]; bk[i][j]=('s',)
            a,b=inner[j-1]; mid=(a+b)/2
            c=dp[i-1][j-1]+abs(mid-exp[i-1])-0.8*min(b-a,0.6)
            if c<dp[i][j]: dp[i][j]=c; bk[i][j]=('t',)
    bounds=[None]*n
    if m>=n:
        i,j=n,m
        while i>0:
            if bk[i][j][0]=='t': bounds[i-1]=inner[j-1]; i-=1; j-=1
            else: j-=1
    arr=[];t0=lead
    for k,x in enumerate(sents):
        if k<n:
            e=bounds[k][0] if bounds[k] else exp[k]; nxt=bounds[k][1] if bounds[k] else exp[k]
        else: e=tail; nxt=tail
        arr.append(dict(text=x,sub=subify(x),start=round(t0,3),end=round(e,3))); t0=nxt
    err=max(abs((bounds[k][0]+bounds[k][1])/2-exp[k]) for k in range(n)) if n and all(bounds) else -1
    out.append(dict(id=s['id'],chapter=s['chapter'],visual=s['visual'],audioDur=round(dur,3),duration=round(dur+0.7,3),sentences=arr))
    print(s['id'],len(sents),len(inner),'maxdev',round(err,2))
json.dump(out,open('remotion/public/timings.json','w'),ensure_ascii=False,indent=1)
print(sum(o['duration'] for o in out)/60)
