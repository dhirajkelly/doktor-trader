import json,re,subprocess,sys,os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
import script
SUBMAP=[("tiga ribu tujuh ratus lima puluh delapan","3.758"),("tiga ribu tujuh ratus lima puluh dua","3.752"),("tiga ribu tujuh ratus lima puluh","3.750"),
("tiga ribu tujuh ratus empat puluh enam","3.746"),("tiga ribu tujuh ratus empat puluh delapan","3.748"),("tiga ribu tujuh ratus empat puluh","3.740"),("tiga ribu tujuh ratus tiga puluh sembilan","3.739"),
("Tiga ribu tujuh ratus lima puluh delapan","3.758"),("Tiga ribu tujuh ratus lima puluh dua","3.752"),
("dua tambah enam tambah empat, balik lagi ke dua belas","2 + 6 + 4, balik lagi ke 12"),("dua belas dolar","$12"),("delapan dolar","$8"),("dua dolar","$2"),("enam dolar","$6"),("empat dolar","$4"),
("sembilan ratus dolar","$900"),("sembilan dolar","$9"),("lima ribu dolar","$5.000"),("lima puluh dolar","$50"),("empat puluh lima dolar","$45"),("seratus dolar","$100"),("satu dolar","$1"),
("Lima puluh dibagi sembilan ratus","$50 ÷ $900"),("nol koma nol lima lima","0,055"),("nol koma nol lima lot","0,05 lot"),("satu persen","1%"),("seratus ons","100 ons"),
("M lima belas","M15"),("M satu","M1"),("M lima","M5"),("H satu","H1"),("H empat","H4"),("D satu","D1"),("MT empat","MT4"),("MT lima","MT5"),
("sepuluh candle","10 candle"),("empat candle","4 candle"),("empat harga","4 harga"),("dhirajkelly dot i d","dhirajkelly.id"),("seperenam","1/6")]
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
