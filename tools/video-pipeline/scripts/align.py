import json,re,subprocess,sys,os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
import script
SUBMAP=[('tujuh ratus tujuh puluh dua ribu lima ratus lima puluh tiga rupiah','Rp772.553'),('dua ratus sembilan puluh tujuh ribu sepuluh rupiah','Rp297.010'),('tujuh ratus tujuh puluh dua ribu','Rp772 ribu'),('empat ratus tujuh puluh lima ribu','Rp475 ribu'),('dua ratus sembilan puluh delapan ribu','Rp298 ribu'),('enam ratus delapan puluh enam ribu','Rp686 ribu'),('lima ratus sembilan puluh satu ribu','Rp591 ribu'),('tiga ratus ribu rupiah','Rp300 ribu'),('enam ratus ribu rupiah','Rp600 ribu'),('dua ratus ribu','Rp200 ribu'),('seratus ribu','Rp100 ribu'),('satu koma empat tiga juta','Rp1,43 juta'),('sepuluh juta','10 juta'),
('tiga ribu lima ratus tujuh puluh lima','3.575'),('tiga ribu empat ratus dua puluh tujuh','3.427'),('seratus empat puluh delapan dolar','$148'),('empat puluh delapan dolar','$48'),('empat puluh satu dolar','$41'),('lima puluh enam dolar','$56'),('lima belas dolar','$15'),
('dua puluh lima November dua ribu dua puluh enam','25 November 2026'),('dua puluh lima November','25 November'),('timeframe satu jam','timeframe H1'),('delapan belas candle','18 candle'),('empat belas punya','14 punya'),
('tujuh koma tujuh tiga persen','7,73%'),('tujuh koma tujuh persen','7,7%'),('dua koma sembilan tujuh persen','2,97%'),('tiga koma nol enam persen','3,06%'),('delapan koma tiga delapan persen','8,38%'),('empat belas koma tiga persen','14,3%'),('lima koma sembilan satu persen','5,91%'),('nol koma nol sembilan persen','0,09%'),('empat belas koma delapan lima persen','14,85%'),('tujuh belas koma empat delapan persen','17,48%'),('dua koma delapan persen','2,8%'),
('satu persen','1%'),('dua persen','2%'),('tiga persen','3%'),('empat persen','4%'),('enam persen','6%'),('delapan persen','8%'),('setengah persen','0,5%'),
('empat belas kali lipat','14 kali lipat'),('delapan kali','8 kali'),('tiga kali','3 kali'),('empat trade','4 trade'),('trade kedelapan','trade ke-8'),('tiga stop loss','3 stop loss'),('enam stop loss','6 stop loss'),('delapan stop loss','8 stop loss'),('empat baris','4 baris'),('empat bagian','4 bagian'),('materi kedua belas','materi ke-12'),
('Jam sembilan pagi','Jam 09.00'),('Jam dua belas','Jam 12.00'),('Jam enam sore','Jam 18.00'),('Jam sepuluh malam','Jam 22.00'),('jam enam sore','jam 18.00'),('jam tujuh','jam 19.00'),('jam delapan malam','jam 20.00'),('jam delapan','jam 20.00'),('jam dua siang','jam 14.00'),
('kira kira','kira-kira'),('dhirajkelly dot i d','dhirajkelly.id')]
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
