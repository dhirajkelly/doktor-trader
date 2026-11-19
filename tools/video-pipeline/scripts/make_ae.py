import json,os
T=json.load(open('remotion/public/timings.json'))
CARD={'trend':('LANGKAH 1','Arah Trend'),'area':('LANGKAH 2','Area Entry'),'confirm':('LANGKAH 3','Konfirmasi'),'sltp':('LANGKAH 4','Stop Loss & Target'),'lot':('RISK FIRST','Ukuran Posisi'),'example':('CONTOH 1','Setup Lengkap'),'loss':('CONTOH 2','Setup yang Gagal'),'skip':('FILTER','Kapan Nggak Entry'),'checklist':('RINGKASAN','Checklist')}
FPS=30;t=0;L=[]
for s in T:
    pad=1.6 if s['visual'] in CARD else (0.15 if s['visual']=='hook' else 0.3)
    L.append((s,t,pad,pad+s['audioDur']+0.9)); t+=pad+s['audioDur']+0.9
END=20.0; total=t+END
def tc(x):
    f=round(x*FPS); return f"{f//108000:02d}:{(f//1800)%60:02d}:{(f//30)%60:02d}:{f%30:02d}"
# EDL
e=["TITLE: Cara Entry XAUUSD Step by Step","FCM: NON-DROP FRAME",""]
for i,(s,st,pad,ln) in enumerate(L,1):
    e+= [f"{i:03d}  {s['id'][:8]:8s} V     C        00:00:00:00 {tc(ln)} {tc(st)} {tc(st+ln)}", f"* FROM CLIP NAME: clips/{s['id']}.mp4",""]
    e+= [f"{i:03d}  VO       A     C        00:00:00:00 {tc(s['audioDur'])} {tc(st+pad)} {tc(st+pad+s['audioDur'])}", f"* FROM CLIP NAME: vo/{s['id']}.mp3",""]
e+=[f"{len(L)+1:03d}  END      V     C        00:00:00:00 {tc(END)} {tc(t)} {tc(total)}","* FROM CLIP NAME: clips/end_screen.mp4",""]
open('out/ae/timeline.edl','w').write("\n".join(e))
# subtitle cues (same algorithm as Remotion)
def cues(sents,off):
    out=[]
    for s in sents:
        w=s['sub'].split(); ch=[];cur=[]
        for x in w:
            cur.append(x)
            if len(cur)>=8 or len(' '.join(cur))>46 or (x[-1] in ',;:' and len(cur)>=4): ch.append(' '.join(cur)); cur=[]
        if cur:
            if len(cur)<=2 and ch: ch[-1]+=' '+' '.join(cur)
            else: ch.append(' '.join(cur))
        tot=sum(len(c) for c in ch); tt=s['start']
        for c in ch:
            d=(s['end']-s['start'])*len(c)/tot; out.append((off+tt,off+tt+d,c)); tt+=d
    return out
srt=[];allc=[]
for s,st,pad,ln in L: allc+=cues(s['sentences'],st+pad)
def st_(x): 
    ms=round(x*1000); return f"{ms//3600000:02d}:{(ms//60000)%60:02d}:{(ms//1000)%60:02d},{ms%1000:03d}"
for i,(a,b,c) in enumerate(allc,1): srt.append(f"{i}\n{st_(a)} --> {st_(b)}\n{c}\n")
open('out/subtitles_id.srt','w').write("\n".join(srt))
# JSX
J=[]
J.append(f"""// Rebuild timeline "Cara Entry XAUUSD Step by Step" in After Effects
// Usage: File > Scripts > Run Script File... and pick this file (keep the folder structure: clips/, vo/).
(function(){{
app.beginUndoGroup("Build dhirajkelly XAUUSD timeline");
var root = File($.fileName).parent;
var NAVY=[11/255,27/255,51/255], GOLD=[201/255,162/255,74/255], TEXT=[244/255,241/255,234/255];
var comp = app.project.items.addComp("XAUUSD_Entry_StepByStep", 1920, 1080, 1, {total:.3f}, 30);
comp.bgColor = NAVY;
function imp(rel){{ var f=new File(root.fsName+"/"+rel); if(!f.exists) return null; return app.project.importFile(new ImportOptions(f)); }}
function ease(prop){{ for (var k=1;k<=prop.numKeys;k++){{ var e=new KeyframeEase(0,75); try{{prop.setTemporalEaseAtKey(k,[e],[e]);}}catch(err){{ try{{prop.setTemporalEaseAtKey(k,[e,e],[e,e]);}}catch(e2){{}} }} }} }}
""")
for s,st,pad,ln in L:
    J.append(f"""var it=imp("clips/{s['id']}.mp4"); if(it){{ var l=comp.layers.add(it); l.startTime={st:.3f}; l.name="{s['id']}"; l.audioEnabled=false; }}
var vo=imp("vo/{s['id']}.mp3"); if(vo){{ var a=comp.layers.add(vo); a.startTime={st+pad:.3f}; a.name="VO_{s['id']}"; }}
comp.markerProperty.setValueAtTime({st:.3f}, new MarkerValue("{s['chapter']}"));""")
    for k,x in enumerate(s['sentences']):
        txt=x['sub'].replace('"','\\"')[:60]
        J.append(f"""comp.layers[1].property("Marker"); comp.markerProperty.setValueAtTime({st+pad+x['start']:.3f}, new MarkerValue("{s['id']} b{k}: {txt}"));""")
    if s['visual'] in CARD:
        k,tt=CARD[s['visual']]
        J.append(f"""(function(){{ var t=comp.layers.addText("{tt}"); t.name="CARD_{s['id']}"; t.inPoint={st:.3f}; t.outPoint={st+pad:.3f};
 var d=t.property("Source Text").value; d.font="PlayfairDisplay-Bold"; d.fontSize=96; d.fillColor=TEXT; d.justification=ParagraphJustification.CENTER_JUSTIFY; t.property("Source Text").setValue(d);
 var p=t.property("Transform").property("Position"); p.setValueAtTime({st:.3f},[960,600]); p.setValueAtTime({st+0.33:.3f},[960,580]); ease(p);
 var o=t.property("Transform").property("Opacity"); o.setValueAtTime({st:.3f},0); o.setValueAtTime({st+0.33:.3f},100); o.setValueAtTime({st+pad-0.27:.3f},100); o.setValueAtTime({st+pad:.3f},0); ease(o);
 var k2=comp.layers.addText("{k}"); k2.name="CARDK_{s['id']}"; k2.inPoint={st:.3f}; k2.outPoint={st+pad:.3f};
 var d2=k2.property("Source Text").value; d2.font="JetBrainsMono-Bold"; d2.fontSize=30; d2.tracking=400; d2.fillColor=GOLD; d2.justification=ParagraphJustification.CENTER_JUSTIFY; k2.property("Source Text").setValue(d2);
 k2.property("Transform").property("Position").setValue([960,470]);
 var o2=k2.property("Transform").property("Opacity"); o2.setValueAtTime({st:.3f},0); o2.setValueAtTime({st+0.33:.3f},100); o2.setValueAtTime({st+pad-0.27:.3f},100); o2.setValueAtTime({st+pad:.3f},0); ease(o2);
}})();""")
J.append(f"""var en=imp("clips/end_screen.mp4"); if(en){{ var le=comp.layers.add(en); le.startTime={t:.3f}; le.name="END_SCREEN"; }}
// Editable subtitles (one text layer per cue, fade 4 frames). Disable the burned-in subtitle in clips if you restyle these.
var subs=[""")
J.append(",\n".join(f'[{a:.3f},{b:.3f},"{c.replace(chr(34),chr(92)+chr(34))}"]' for a,b,c in allc))
J.append("""];
var subFolder = comp.layers.addNull(); subFolder.name="SUBS_CONTROL";
for (var i=0;i<subs.length;i++){ var s=subs[i]; var t=comp.layers.addText(s[2]); t.name="SUB_"+(i+1); t.inPoint=s[0]; t.outPoint=s[1]+0.12; t.enabled=false;
 var d=t.property("Source Text").value; d.font="Helvetica-Bold"; d.fontSize=46; d.fillColor=[1,1,1]; d.justification=ParagraphJustification.CENTER_JUSTIFY; t.property("Source Text").setValue(d);
 t.property("Transform").property("Position").setValue([960,990]);
 var o=t.property("Transform").property("Opacity"); o.setValueAtTime(s[0],0); o.setValueAtTime(s[0]+0.13,100); }
app.endUndoGroup();
alert("Timeline dibangun: "+comp.name+" (subtitle layer editable ada tapi di-disable; aktifkan kalau mau restyle).");
})();""")
open('out/ae/build_timeline.jsx','w').write("\n".join(J))
print(len(allc),'cues', round(total,2))
