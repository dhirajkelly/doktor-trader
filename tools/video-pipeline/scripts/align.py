import json,re,subprocess,sys,os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
import script
SUBMAP=[('dua November sampai dua puluh delapan November dua ribu dua puluh enam','2–28 November 2026'),('dua puluh lima November','25 November'),
('tiga ribu empat ratus enam puluh tujuh','3.467'),('tiga ribu lima ratus lima puluh','3.550'),('tiga ribu lima ratus dua puluh','3.520'),('tiga ribu empat ratus sembilan puluh','3.490'),('tiga ribu empat ratus tujuh puluh','3.470'),
('sepuluh ribu dolar','$10.000'),('dua ratus delapan puluh dolar','$280'),('dua ratus delapan puluh','$280'),('satu dolar per satu dolar','$1 per $1'),('delapan puluh dolar','$80'),('tiga ratus dolar','$300'),('dua ratus dolar','$200'),('seratus dolar','$100'),('lima puluh dolar','$50'),('dua puluh dolar','$20'),
('nol koma nol satu','0,01'),('nol koma nol dua','0,02'),('nol koma nol lima','0,05'),('nol koma sembilan satu','0,91'),
('dua sampai tiga persen','2–3%'),('dua koma delapan persen','2,8%'),('dua koma satu persen','2,1%'),('dua koma dua persen','2,2%'),('satu persen','1%'),('dua persen','2%'),('tiga persen','3%'),
('seratus sembilan belas candle empat jam','119 candle H4'),('seratus empat candle','104 candle'),('timeframe satu jam','timeframe H1'),('timeframe empat jam','timeframe H4'),
('Jam delapan malam','Jam 20.00'),('Jam satu siang','Jam 13.00'),('Jam enam sore','Jam 18.00'),('materi ketiga belas','materi ke-13'),('empat minggu','4 minggu'),('tiga kali lipat','3 kali lipat'),
('Angka satu artinya','Angka 1 artinya'),('nol artinya','0 artinya'),('dhirajkelly dot i d','dhirajkelly.id')]
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
