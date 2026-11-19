import json,sys
T=json.load(open('remotion/public/timings.json'))
CARD={'trend','area','confirm','sltp','lot','example','loss','skip','checklist'}
t=0;pos={}
for s in T:
    pad=1.6 if s['visual'] in CARD else (0.15 if s['visual']=='hook' else 0.3)
    pos[s['id']]=(t,pad,s); t+=pad+s['audioDur']+0.9
def fr(sid,k,extra=0):
    t0,pad,s=pos[sid]; return round((t0+pad+s['sentences'][k]['start']+extra)*30)
picks=[('s01_hook',3,1.5),('s01_hook',7,0),('s02_setup',6,1),('s03_trend',6,1),('s03_trend',8,1),('s03_trend',10,1),('s04_area',8,1),('s04_area',13,1.5),('s05_confirm',10,2),('s06_sltp',4,1),('s06_sltp',11,1),('s07_lot',12,1),('s08_example',12,1),('s08b_loss',5,1),('s08b_loss',13,1),('s09_skip',7,0),('s10_checklist',7,1),('s11_cta',5,1)]
print(' '.join(f"{a}:{fr(a,k,e)}" for a,k,e in picks))
print('card', round((pos['s03_trend'][0]+0.8)*30))
